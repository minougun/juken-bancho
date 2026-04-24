namespace JukenBancho.Core
{
    public sealed class EndingResult
    {
        public string Id;
        public string Title;
        public string Body;
    }

    public sealed class EndingResolver
    {
        public EndingResult Resolve(GameState state)
        {
            if (state == null)
            {
                return NewEnding("invalid", "記録なし", "受験票が見つからない。まずはゲームを始めよう。");
            }

            StatBlock s = state.Stats;
            if (s.Academics >= 75 && s.Trust >= 45 && s.Face >= 45)
            {
                return NewEnding(
                    "passed_bancho",
                    "合格番長",
                    "合格発表の日、仲間たちは胴上げの準備をしていた。学力も仁義も守り抜いた、お前こそ受験番長だ。");
            }

            if (s.Academics >= 75)
            {
                return NewEnding(
                    "lonely_pass",
                    "孤独な合格",
                    "合格はした。だが校門前に仲間の姿は少ない。机に向かった時間の重さを、お前だけが知っている。");
            }

            if (s.Academics >= 62 && s.Trust >= 70 && s.Face >= 70)
            {
                return NewEnding(
                    "waitlist_legend",
                    "補欠の伝説",
                    "点数は少し足りない。だが仲間たちは誰も責めない。来年、伝説の第二章が始まる。");
            }

            if (s.Trust >= 82 && s.Face >= 82)
            {
                return NewEnding(
                    "bancho_legend",
                    "番長伝説",
                    "受験には敗れた。しかし校内でお前の名を知らぬ者はいない。問題集より厚い武勇伝が残った。");
            }

            return NewEnding(
                "failed",
                "不合格",
                "勉強も仁義も中途半端だった。だが答案用紙は逃げない。次は予定から締め直せ。");
        }

        private static EndingResult NewEnding(string id, string title, string body)
        {
            return new EndingResult
            {
                Id = id,
                Title = title,
                Body = body
            };
        }
    }
}
