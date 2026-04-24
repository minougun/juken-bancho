using System.Collections.Generic;
using JukenBancho.Core;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

namespace JukenBancho.UI
{
    public sealed class JukenBanchoGamePresenter : MonoBehaviour
    {
        private readonly TurnResolver turnResolver = new TurnResolver();
        private readonly EndingResolver endingResolver = new EndingResolver();

        private GameState state;
        private List<CardData> cards;
        private List<RandomEventData> events;
        private IRandomSource random;
        private Font uiFont;

        private RectTransform contentRoot;
        private Text turnText;
        private Text statText;
        private Text logText;
        private Transform cardListRoot;
        private GameObject resultPanel;
        private Text resultTitleText;
        private Text resultBodyText;

        private static readonly Color Ink = ColorFromHex("171717");
        private static readonly Color Muted = ColorFromHex("4D4D4D");
        private static readonly Color Paper = Color.white;
        private static readonly Color Soft = ColorFromHex("FAFAFA");
        private static readonly Color Danger = ColorFromHex("FF5B4F");
        private static readonly Color FocusBlue = ColorFromHex("0A72EF");

        private void Start()
        {
            StartNewGame();
        }

        private void StartNewGame()
        {
            state = DefaultContent.CreateInitialState();
            cards = DefaultContent.CreateCards();
            events = DefaultContent.CreateEvents();
            random = new SystemRandomSource();
            uiFont = ResolveJapaneseFont(24);

            BuildUi();
            Render();
        }

        private void BuildUi()
        {
            for (int i = transform.childCount - 1; i >= 0; i--)
            {
                Destroy(transform.GetChild(i).gameObject);
            }

            EnsureEventSystem();

            GameObject canvasObject = new GameObject("JukenBanchoCanvas", typeof(RectTransform));
            canvasObject.transform.SetParent(transform, false);
            var canvas = canvasObject.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvasObject.AddComponent<GraphicRaycaster>();

            var scaler = canvasObject.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.65f;

            GameObject background = CreatePanel("Background", canvasObject.transform, Paper);
            Stretch(background.GetComponent<RectTransform>());

            GameObject scrollObject = CreatePanel("Scroll", background.transform, Paper);
            Stretch(scrollObject.GetComponent<RectTransform>());
            var scrollRect = scrollObject.AddComponent<ScrollRect>();
            scrollRect.horizontal = false;
            scrollRect.movementType = ScrollRect.MovementType.Clamped;

            GameObject viewport = CreatePanel("Viewport", scrollObject.transform, Paper);
            Stretch(viewport.GetComponent<RectTransform>());
            viewport.AddComponent<Mask>().showMaskGraphic = false;
            scrollRect.viewport = viewport.GetComponent<RectTransform>();

            GameObject contentObject = new GameObject("Content", typeof(RectTransform));
            contentObject.transform.SetParent(viewport.transform, false);
            contentRoot = contentObject.GetComponent<RectTransform>();
            contentRoot.anchorMin = new Vector2(0, 1);
            contentRoot.anchorMax = new Vector2(1, 1);
            contentRoot.pivot = new Vector2(0.5f, 1);
            contentRoot.offsetMin = Vector2.zero;
            contentRoot.offsetMax = Vector2.zero;
            scrollRect.content = contentRoot;

            var layout = contentObject.AddComponent<VerticalLayoutGroup>();
            layout.padding = new RectOffset(32, 32, 28, 40);
            layout.spacing = 18;
            layout.childControlWidth = true;
            layout.childControlHeight = true;
            layout.childForceExpandWidth = true;
            layout.childForceExpandHeight = false;
            contentObject.AddComponent<ContentSizeFitter>().verticalFit = ContentSizeFitter.FitMode.PreferredSize;

            AddHeader(contentRoot);
            AddStats(contentRoot);
            AddCards(contentRoot);
            AddLog(contentRoot);
            AddResultPanel(contentRoot);
        }

        private void AddHeader(Transform parent)
        {
            GameObject header = CreatePanel("Header", parent, Ink);
            AddLayoutElement(header, -1, 178);
            AddCardDepth(header, new Color(0f, 0f, 0f, 0.08f));

            var group = header.AddComponent<VerticalLayoutGroup>();
            group.padding = new RectOffset(28, 28, 22, 18);
            group.spacing = 8;
            group.childControlWidth = true;
            group.childControlHeight = true;
            group.childForceExpandWidth = true;
            group.childForceExpandHeight = false;

            Text title = CreateText("Title", header.transform, "受験番長", 48, FontStyle.Bold, Color.white, TextAnchor.MiddleLeft);
            title.resizeTextForBestFit = true;
            title.resizeTextMinSize = 32;
            AddLayoutElement(title.gameObject, -1, 72);

            turnText = CreateText("Turn", header.transform, string.Empty, 24, FontStyle.Normal, new Color(1f, 1f, 1f, 0.82f), TextAnchor.MiddleLeft);
            AddLayoutElement(turnText.gameObject, -1, 42);
        }

        private void AddStats(Transform parent)
        {
            GameObject stats = CreatePanel("Stats", parent, Soft);
            AddLayoutElement(stats, -1, 210);
            AddCardDepth(stats, new Color(0f, 0f, 0f, 0.08f));

            var group = stats.AddComponent<VerticalLayoutGroup>();
            group.padding = new RectOffset(24, 24, 18, 18);
            group.spacing = 10;
            group.childControlWidth = true;
            group.childControlHeight = true;
            group.childForceExpandWidth = true;
            group.childForceExpandHeight = false;

            Text label = CreateText("StatsLabel", stats.transform, "現在の番長コンディション", 22, FontStyle.Bold, Ink, TextAnchor.MiddleLeft);
            AddLayoutElement(label.gameObject, -1, 36);

            statText = CreateText("StatsText", stats.transform, string.Empty, 26, FontStyle.Normal, Ink, TextAnchor.UpperLeft);
            statText.lineSpacing = 1.12f;
            AddLayoutElement(statText.gameObject, -1, 128);
        }

        private void AddCards(Transform parent)
        {
            GameObject section = CreatePanel("CardsSection", parent, Paper);
            AddLayoutElement(section, -1, -1);

            var group = section.AddComponent<VerticalLayoutGroup>();
            group.spacing = 12;
            group.childControlWidth = true;
            group.childControlHeight = true;
            group.childForceExpandWidth = true;
            group.childForceExpandHeight = false;
            section.AddComponent<ContentSizeFitter>().verticalFit = ContentSizeFitter.FitMode.PreferredSize;

            Text label = CreateText("CardsLabel", section.transform, "今日の予定を選ぶ", 26, FontStyle.Bold, Ink, TextAnchor.MiddleLeft);
            AddLayoutElement(label.gameObject, -1, 42);

            GameObject list = new GameObject("Cards", typeof(RectTransform));
            list.transform.SetParent(section.transform, false);
            cardListRoot = list.transform;
            var listGroup = list.AddComponent<VerticalLayoutGroup>();
            listGroup.spacing = 12;
            listGroup.childControlWidth = true;
            listGroup.childControlHeight = true;
            listGroup.childForceExpandWidth = true;
            listGroup.childForceExpandHeight = false;
            list.AddComponent<ContentSizeFitter>().verticalFit = ContentSizeFitter.FitMode.PreferredSize;
        }

        private void AddLog(Transform parent)
        {
            GameObject log = CreatePanel("Log", parent, Soft);
            AddLayoutElement(log, -1, 230);
            AddCardDepth(log, new Color(0f, 0f, 0f, 0.08f));

            var group = log.AddComponent<VerticalLayoutGroup>();
            group.padding = new RectOffset(24, 24, 18, 18);
            group.spacing = 8;
            group.childControlWidth = true;
            group.childControlHeight = true;
            group.childForceExpandWidth = true;
            group.childForceExpandHeight = false;

            Text label = CreateText("LogLabel", log.transform, "直近の出来事", 22, FontStyle.Bold, Ink, TextAnchor.MiddleLeft);
            AddLayoutElement(label.gameObject, -1, 32);

            logText = CreateText("LogText", log.transform, string.Empty, 24, FontStyle.Normal, Muted, TextAnchor.UpperLeft);
            logText.lineSpacing = 1.12f;
            AddLayoutElement(logText.gameObject, -1, 150);
        }

        private void AddResultPanel(Transform parent)
        {
            resultPanel = CreatePanel("Result", parent, Ink);
            AddLayoutElement(resultPanel, -1, 310);
            AddCardDepth(resultPanel, new Color(0f, 0f, 0f, 0.08f));

            var group = resultPanel.AddComponent<VerticalLayoutGroup>();
            group.padding = new RectOffset(28, 28, 24, 24);
            group.spacing = 12;
            group.childControlWidth = true;
            group.childControlHeight = true;
            group.childForceExpandWidth = true;
            group.childForceExpandHeight = false;

            resultTitleText = CreateText("ResultTitle", resultPanel.transform, string.Empty, 36, FontStyle.Bold, Color.white, TextAnchor.MiddleLeft);
            AddLayoutElement(resultTitleText.gameObject, -1, 56);

            resultBodyText = CreateText("ResultBody", resultPanel.transform, string.Empty, 24, FontStyle.Normal, new Color(1f, 1f, 1f, 0.82f), TextAnchor.UpperLeft);
            resultBodyText.lineSpacing = 1.16f;
            AddLayoutElement(resultBodyText.gameObject, -1, 140);

            Button restart = CreateButton("RestartButton", resultPanel.transform, "もう一周する", Ink, Color.white, 26);
            AddLayoutElement(restart.gameObject, -1, 64);
            restart.onClick.AddListener(StartNewGame);
        }

        private void Render()
        {
            turnText.text = "残り " + (state.TotalTurns - state.Turn) + " ターン / 受験まで " + state.TotalTurns + " 週";
            statText.text =
                "学力 " + FormatStat(state.Stats.Academics) + "    人望 " + FormatStat(state.Stats.Trust) + "\n" +
                "メンツ " + FormatStat(state.Stats.Face) + "    体力 " + FormatStat(state.Stats.Stamina) + "\n" +
                "ストレス " + FormatStat(state.Stats.Stress);

            logText.text = state.Log.Count == 0 ? "まだ何も起きていない。" : state.Log[state.Log.Count - 1];

            for (int i = cardListRoot.childCount - 1; i >= 0; i--)
            {
                Destroy(cardListRoot.GetChild(i).gameObject);
            }

            if (state.IsComplete)
            {
                resultPanel.SetActive(true);
                EndingResult ending = endingResolver.Resolve(state);
                resultTitleText.text = ending.Title;
                resultBodyText.text = ending.Body;
                return;
            }

            resultPanel.SetActive(false);
            List<CardData> available = DefaultContent.GetAvailableCards(state, cards);
            for (int i = 0; i < available.Count; i++)
            {
                AddCardButton(available[i]);
            }
        }

        private void AddCardButton(CardData card)
        {
            Button button = CreateButton("Card_" + card.Id, cardListRoot, string.Empty, Paper, Ink, 24);
            AddLayoutElement(button.gameObject, -1, 148);
            AddCardDepth(button.gameObject, new Color(0f, 0f, 0f, 0.08f));

            var group = button.gameObject.AddComponent<VerticalLayoutGroup>();
            group.padding = new RectOffset(22, 22, 14, 14);
            group.spacing = 4;
            group.childControlWidth = true;
            group.childControlHeight = true;
            group.childForceExpandWidth = true;
            group.childForceExpandHeight = false;

            Text title = CreateText("CardTitle", button.transform, card.Title, 26, FontStyle.Bold, Ink, TextAnchor.MiddleLeft);
            AddLayoutElement(title.gameObject, -1, 36);

            Text subtitle = CreateText("CardSubtitle", button.transform, card.Subtitle, 21, FontStyle.Normal, Muted, TextAnchor.MiddleLeft);
            AddLayoutElement(subtitle.gameObject, -1, 32);

            Text effect = CreateText("CardEffect", button.transform, FormatEffects(card.Effects), 20, FontStyle.Normal, EffectColor(card), TextAnchor.MiddleLeft);
            AddLayoutElement(effect.gameObject, -1, 28);

            CardData captured = card;
            button.onClick.AddListener(delegate { ChooseCard(captured); });
        }

        private void ChooseCard(CardData card)
        {
            TurnResult result = turnResolver.ApplyCard(state, card, events, random);
            if (result.Success)
            {
                state = result.State;
            }
            else if (state != null)
            {
                state.Log.Add(result.Message);
            }

            Render();
        }

        private static string FormatStat(int value)
        {
            return value.ToString("00");
        }

        private static string FormatEffects(StatBlock effects)
        {
            var parts = new List<string>();
            AddEffect(parts, "学力", effects.Academics);
            AddEffect(parts, "人望", effects.Trust);
            AddEffect(parts, "メンツ", effects.Face);
            AddEffect(parts, "体力", effects.Stamina);
            AddEffect(parts, "ストレス", effects.Stress);
            return string.Join("  ", parts.ToArray());
        }

        private static void AddEffect(List<string> parts, string label, int value)
        {
            if (value == 0)
            {
                return;
            }

            parts.Add(label + (value > 0 ? "+" : string.Empty) + value);
        }

        private static Color EffectColor(CardData card)
        {
            if (card.Tag == ActionTag.Fight)
            {
                return Danger;
            }

            if (card.Tag == ActionTag.Study || card.Tag == ActionTag.ExamPrep)
            {
                return FocusBlue;
            }

            return Muted;
        }

        private Text CreateText(string name, Transform parent, string value, int size, FontStyle style, Color color, TextAnchor anchor)
        {
            GameObject textObject = new GameObject(name, typeof(RectTransform));
            textObject.transform.SetParent(parent, false);
            Text text = textObject.AddComponent<Text>();
            text.text = value;
            text.font = uiFont;
            text.fontSize = size;
            text.fontStyle = style;
            text.color = color;
            text.alignment = anchor;
            text.horizontalOverflow = HorizontalWrapMode.Wrap;
            text.verticalOverflow = VerticalWrapMode.Truncate;
            return text;
        }

        private Button CreateButton(string name, Transform parent, string label, Color background, Color textColor, int fontSize)
        {
            GameObject buttonObject = CreatePanel(name, parent, background);
            Button button = buttonObject.AddComponent<Button>();
            button.targetGraphic = buttonObject.GetComponent<Image>();
            ColorBlock colors = button.colors;
            colors.normalColor = background;
            colors.highlightedColor = Lerp(background, ColorFromHex("EBEBEB"), 0.35f);
            colors.pressedColor = Lerp(background, Ink, 0.08f);
            colors.selectedColor = colors.highlightedColor;
            button.colors = colors;

            if (!string.IsNullOrEmpty(label))
            {
                Text text = CreateText("Label", buttonObject.transform, label, fontSize, FontStyle.Bold, textColor, TextAnchor.MiddleCenter);
                Stretch(text.GetComponent<RectTransform>());
            }

            return button;
        }

        private static GameObject CreatePanel(string name, Transform parent, Color color)
        {
            GameObject panel = new GameObject(name, typeof(RectTransform));
            panel.transform.SetParent(parent, false);
            Image image = panel.AddComponent<Image>();
            image.color = color;
            return panel;
        }

        private static void AddCardDepth(GameObject target, Color outlineColor)
        {
            Outline outline = target.AddComponent<Outline>();
            outline.effectColor = outlineColor;
            outline.effectDistance = new Vector2(1f, -1f);

            Shadow shadow = target.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.04f);
            shadow.effectDistance = new Vector2(0f, -2f);
        }

        private static void AddLayoutElement(GameObject target, float preferredWidth, float preferredHeight)
        {
            LayoutElement element = target.GetComponent<LayoutElement>();
            if (element == null)
            {
                element = target.AddComponent<LayoutElement>();
            }

            if (preferredWidth >= 0)
            {
                element.preferredWidth = preferredWidth;
            }

            if (preferredHeight >= 0)
            {
                element.preferredHeight = preferredHeight;
            }
        }

        private static void Stretch(RectTransform rect)
        {
            rect.anchorMin = Vector2.zero;
            rect.anchorMax = Vector2.one;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;
        }

        private static void EnsureEventSystem()
        {
            if (EventSystem.current != null)
            {
                return;
            }

            GameObject eventSystem = new GameObject("EventSystem");
            eventSystem.AddComponent<EventSystem>();
            eventSystem.AddComponent<StandaloneInputModule>();
        }

        private static Font ResolveJapaneseFont(int size)
        {
            string[] fontNames =
            {
                "Hiragino Sans",
                "Hiragino Kaku Gothic ProN",
                "Noto Sans JP",
                "Yu Gothic",
                "Meiryo",
                "Arial"
            };
            Font font = Font.CreateDynamicFontFromOSFont(fontNames, size);
            if (font != null)
            {
                return font;
            }

            return Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
        }

        private static Color ColorFromHex(string hex)
        {
            Color color;
            if (ColorUtility.TryParseHtmlString("#" + hex, out color))
            {
                return color;
            }

            return Color.white;
        }

        private static Color Lerp(Color a, Color b, float t)
        {
            return new Color(
                Mathf.Lerp(a.r, b.r, t),
                Mathf.Lerp(a.g, b.g, t),
                Mathf.Lerp(a.b, b.b, t),
                Mathf.Lerp(a.a, b.a, t));
        }
    }
}
