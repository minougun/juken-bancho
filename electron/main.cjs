const { app, BrowserWindow, Menu, shell } = require("electron");
const { createServer } = require("node:net");
const path = require("node:path");

let webServer;

function getFreePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => resolvePort(address.port));
    });
  });
}

async function startLocalGameServer() {
  const port = await getFreePort();
  const serverModule = await import(pathToFileUrl(path.join(__dirname, "..", "web", "server.mjs")));
  const started = await serverModule.startJukenBanchoWebServer({
    port,
    host: "127.0.0.1",
    log: process.env.JUKEN_BANCHO_DESKTOP_LOG ? console.log : null,
  });
  webServer = started.server;
  return started.url;
}

function pathToFileUrl(filePath) {
  const normalized = path.resolve(filePath).replace(/\\/g, "/");
  return `file://${normalized.startsWith("/") ? "" : "/"}${normalized}`;
}

async function createMainWindow() {
  const gameUrl = await startLocalGameServer();
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 360,
    minHeight: 640,
    backgroundColor: "#f8f1e2",
    title: "受験番長",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: Boolean(process.env.JUKEN_BANCHO_DEVTOOLS),
    },
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) {
      void shell.openExternal(url);
    }
    return { action: "deny" };
  });

  window.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith(gameUrl)) {
      event.preventDefault();
      if (/^https?:\/\//i.test(url)) {
        void shell.openExternal(url);
      }
    }
  });

  await window.loadURL(gameUrl);
}

app.setName("受験番長");

app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);
  await createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  webServer?.close();
  webServer = null;
});
