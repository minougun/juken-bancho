using System.Collections.Generic;

namespace JukenBancho.Core
{
    public static class DefaultContent
    {
        public const int TotalTurns = 18;

        public static GameState CreateInitialState()
        {
            return GameState.CreateNew(
                TotalTurns,
                new StatBlock(academics: 22, trust: 62, face: 60, stamina: 72, stress: 18));
        }

        public static List<CardData> CreateCards()
        {
            return new List<CardData>
            {
                new CardData(
                    "study_library",
                    "自習室に乗り込む",
                    "静寂を制する者が受験を制す",
                    "参考書を机に叩きつける。今日はシャーペンが相棒だ。",
                    new StatBlock(10, -2, -1, -10, 8),
                    minStamina: 12,
                    unlockTurn: 0,
                    oneShot: false,
                    tag: ActionTag.Study),
                new CardData(
                    "cram_school",
                    "補習を受ける",
                    "先生に頭を下げるのも器量",
                    "番長のメンツは少し削れるが、赤点回避の技術は身につく。",
                    new StatBlock(8, 3, -5, -8, 5),
                    minStamina: 10,
                    unlockTurn: 0,
                    oneShot: false,
                    tag: ActionTag.Teacher),
                new CardData(
                    "ramen_meeting",
                    "仲間とラーメン会議",
                    "替え玉より厚い信頼",
                    "湯気の向こうで進路相談と近況報告を聞く。",
                    new StatBlock(-2, 9, 2, 4, -4),
                    minStamina: 0,
                    unlockTurn: 0,
                    oneShot: false,
                    tag: ActionTag.Social),
                new CardData(
                    "rescue_fight",
                    "仲裁に走る",
                    "仲間が絡まれたら、まず止めに入る",
                    "参考書を閉じ、校門へ走る。拳より先に声を張るのが、今日の答案だ。",
                    new StatBlock(-3, 8, 9, -16, 7),
                    minStamina: 24,
                    unlockTurn: 0,
                    oneShot: false,
                    tag: ActionTag.Fight),
                new CardData(
                    "sleep_early",
                    "今日は寝る",
                    "番長も睡眠で回復する",
                    "布団に沈む。夢の中で英単語とタイマンを張る。",
                    new StatBlock(0, -1, -1, 26, -17),
                    minStamina: 0,
                    unlockTurn: 0,
                    oneShot: false,
                    tag: ActionTag.Rest),
                new CardData(
                    "mock_exam",
                    "模試に特攻",
                    "点数表から逃げない",
                    "結果から逃げない。点数表を見て次の一手を決める。",
                    new StatBlock(14, 0, 3, -14, 12),
                    minStamina: 20,
                    unlockTurn: 5,
                    oneShot: true,
                    tag: ActionTag.ExamPrep),
                new CardData(
                    "final_sprint",
                    "赤本ラストスパート",
                    "本番直前の詰め込み仁義",
                    "眠気も弱音も廊下に立たせる。最後は過去問だ。",
                    new StatBlock(18, -3, 0, -20, 16),
                    minStamina: 28,
                    unlockTurn: 12,
                    oneShot: true,
                    tag: ActionTag.ExamPrep)
            };
        }

        public static List<RandomEventData> CreateEvents()
        {
            return new List<RandomEventData>
            {
                new RandomEventData(
                    "rival_school",
                    "ライバル校の挑発",
                    "売られた喧嘩を買わずに睨みだけで返した。余計な火種は消えた。",
                    new StatBlock(0, 2, 4, -5, 3),
                    minTurn: 2,
                    chance: 0.12f,
                    gateStat: null,
                    gateBelowOrEqual: 0),
                new RandomEventData(
                    "friend_panic",
                    "仲間の進路相談",
                    "話を聞いたら、自分の焦りも少し言葉になった。",
                    new StatBlock(2, 6, 0, -4, -3),
                    minTurn: 3,
                    chance: 0.10f,
                    gateStat: null,
                    gateBelowOrEqual: 0),
                new RandomEventData(
                    "teacher_warning",
                    "生活指導の呼び出し",
                    "廊下の説教は長い。だが願書の締切も教えてもらった。",
                    new StatBlock(4, 0, -6, -3, 5),
                    minTurn: 4,
                    chance: 0.10f,
                    gateStat: StatType.Face,
                    gateBelowOrEqual: 45),
                new RandomEventData(
                    "burnout_hint",
                    "深夜の集中切れ",
                    "目が滑る。今日は単語帳を閉じる勇気も必要だ。",
                    new StatBlock(-3, 0, 0, 8, -10),
                    minTurn: 6,
                    chance: 0.15f,
                    gateStat: StatType.Stress,
                    gateBelowOrEqual: 100),
                new RandomEventData(
                    "exam_ticket_panic",
                    "受験票が消えた夜",
                    "受験票がないと大騒ぎになった。机も鞄も総ざらいして、最後は単語帳の間から見つかった。",
                    new StatBlock(5, 8, -4, -12, 14),
                    minTurn: 10,
                    chance: 0.06f,
                    gateStat: null,
                    gateBelowOrEqual: 0),
                new RandomEventData(
                    "principal_truce",
                    "校長室の休戦協定",
                    "番長の顔で揉め事を収め、受験生として自習室の鍵も預かった。なぜか校内が静かになった。",
                    new StatBlock(8, 4, 6, -6, -4),
                    minTurn: 12,
                    chance: 0.05f,
                    gateStat: StatType.Trust,
                    gateBelowOrEqual: 100)
            };
        }

        public static List<CardData> GetAvailableCards(GameState state, IReadOnlyList<CardData> allCards)
        {
            var available = new List<CardData>();
            for (int i = 0; i < allCards.Count; i++)
            {
                if (allCards[i].IsAvailable(state))
                {
                    available.Add(allCards[i]);
                }
            }

            return available;
        }
    }
}
