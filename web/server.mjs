import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const port = Number(process.env.PORT || 4173);
const voicevoxProxyBase = safeVoicevoxProxyBase(process.env.VOICEVOX_ENGINE_URL ?? "http://127.0.0.1:50021");
const maxVoicevoxBodyBytes = 512 * 1024;
const maxVoicevoxTextLength = 500;
const voicevoxFetchTimeoutMs = 8000;
const voicevoxProxyEndpoints = new Map([
  ["GET /version", "version"],
  ["GET /speakers", "speakers"],
  ["POST /audio_query", "audio_query"],
  ["POST /synthesis", "synthesis"],
]);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
};

const server = createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  if (url.pathname.startsWith("/voicevox/")) {
    void handleVoicevoxProxy(request, response, url);
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method Not Allowed");
    return;
  }

  const pathname = decodeURIComponent(url.pathname);
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  let filePath = resolve(join(root, safePath));

  if (filePath !== root && !filePath.startsWith(root + sep)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  if (!existsSync(filePath)) {
    response.writeHead(404);
    response.end("Not Found");
    return;
  }

  if (statSync(filePath).isDirectory()) {
    filePath = join(filePath, "index.html");
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404);
    response.end("Not Found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
    "Cache-Control": "no-store",
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`受験番長 Web test server: http://127.0.0.1:${port}/`);
  console.log(`Serving: ${root}`);
});

async function handleVoicevoxProxy(request, response, url) {
  const endpoint = url.pathname.replace(/^\/voicevox\/?/, "/");
  const routeKey = `${request.method} ${endpoint}`;
  const enginePath = voicevoxProxyEndpoints.get(routeKey);
  if (!enginePath) {
    response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "VOICEVOX endpoint is not allowed" }));
    return;
  }

  try {
    const validationError = validateVoicevoxProxyRequest(request, endpoint, url);
    if (validationError) {
      response.writeHead(validationError.status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
      response.end(JSON.stringify({ error: validationError.message }));
      return;
    }

    const engineUrl = new URL(enginePath, `${voicevoxProxyBase.replace(/\/$/, "")}/`);
    for (const [key, value] of url.searchParams) {
      engineUrl.searchParams.set(key, value);
    }
    const body = request.method === "POST" ? await readRequestBody(request, maxVoicevoxBodyBytes) : undefined;
    const bodyValidationError = validateVoicevoxProxyBody(request, endpoint, body);
    if (bodyValidationError) {
      response.writeHead(bodyValidationError.status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
      response.end(JSON.stringify({ error: bodyValidationError.message }));
      return;
    }
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), voicevoxFetchTimeoutMs);
    let engineResponse;
    try {
      engineResponse = await fetch(engineUrl, {
        method: request.method,
        headers: body ? { "Content-Type": request.headers["content-type"] || "application/json" } : undefined,
        body,
        signal: abortController.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
    response.writeHead(engineResponse.status, {
      "Content-Type": engineResponse.headers.get("content-type") || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    const arrayBuffer = await engineResponse.arrayBuffer();
    response.end(Buffer.from(arrayBuffer));
  } catch (error) {
    if (error?.message === "request body too large") {
      response.writeHead(413, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
      response.end(JSON.stringify({ error: "VOICEVOX request body is too large" }));
      return;
    }
    response.writeHead(503, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    response.end(JSON.stringify({ error: "VOICEVOX Engine is not running" }));
  }
}

function safeVoicevoxProxyBase(rawBase) {
  const parsed = new URL(rawBase);
  if (parsed.protocol !== "http:" || parsed.hostname !== "127.0.0.1" || parsed.port !== "50021") {
    throw new Error("VOICEVOX_ENGINE_URL must point to http://127.0.0.1:50021");
  }
  return parsed.origin;
}

function validateVoicevoxProxyRequest(request, endpoint, url) {
  const contentLength = Number(request.headers["content-length"] ?? 0);
  if (Number.isFinite(contentLength) && contentLength > maxVoicevoxBodyBytes) {
    return { status: 413, message: "VOICEVOX request body is too large" };
  }
  if ((endpoint === "/audio_query" || endpoint === "/synthesis") && !/^\d+$/.test(url.searchParams.get("speaker") ?? "")) {
    return { status: 400, message: "VOICEVOX speaker must be a numeric id" };
  }
  if (endpoint === "/audio_query") {
    const text = url.searchParams.get("text") ?? "";
    if (!text.trim() || text.length > maxVoicevoxTextLength) {
      return { status: 400, message: "VOICEVOX text must be 1 to 500 characters" };
    }
  }
  return null;
}

function validateVoicevoxProxyBody(request, endpoint, body) {
  const contentType = String(request.headers["content-type"] ?? "");
  if (body?.length && !/^application\/json\b/i.test(contentType)) {
    return { status: 415, message: "VOICEVOX proxy only accepts application/json bodies" };
  }
  if (endpoint !== "/synthesis") {
    return null;
  }
  if (!body?.length) {
    return { status: 400, message: "VOICEVOX synthesis requires an audio query body" };
  }
  try {
    const parsed = JSON.parse(body.toString("utf8"));
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.accent_phrases)) {
      return { status: 400, message: "VOICEVOX synthesis body must be an audio query object" };
    }
  } catch {
    return { status: 400, message: "VOICEVOX synthesis body must be valid JSON" };
  }
  return null;
}

function readRequestBody(request, maxBytes) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    let totalBytes = 0;
    request.on("data", (chunk) => {
      totalBytes += chunk.length;
      if (totalBytes > maxBytes) {
        reject(new Error("request body too large"));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => resolveBody(Buffer.concat(chunks)));
    request.on("error", reject);
  });
}
