using System.Collections.Generic;

namespace JukenBancho.Core
{
    public sealed class TurnResolver
    {
        public TurnResult ApplyCard(GameState current, CardData card, IReadOnlyList<RandomEventData> events, IRandomSource random)
        {
            if (current == null)
            {
                return TurnResult.Failure(null, "ゲーム状態がありません。");
            }

            if (current.IsComplete)
            {
                return TurnResult.Failure(current, "受験本番はもう終わっている。");
            }

            if (card == null)
            {
                return TurnResult.Failure(current, "その予定は存在しない。");
            }

            if (!card.IsAvailable(current))
            {
                return TurnResult.Failure(current, "今の体力や状況では、その予定は選べない。");
            }

            var next = current.Clone();
            next.Turn += 1;
            next.Stats.Add(card.Effects);

            if (card.OneShot)
            {
                next.UsedCardIds.Add(card.Id);
            }

            next.Stats.Clamp();

            string eventTitle = string.Empty;
            string eventMessage = TryApplyRandomEvent(next, events, random, out eventTitle);
            ApplyPressureRules(next);

            if (next.Turn >= next.TotalTurns)
            {
                next.IsComplete = true;
            }

            string message = card.Title + "を選んだ。" + BuildEffectSummary(card.Effects);
            if (!string.IsNullOrEmpty(eventMessage))
            {
                message += "\n" + eventMessage;
            }

            next.Log.Add(message);
            return TurnResult.Ok(next, message, eventTitle);
        }

        private static string TryApplyRandomEvent(GameState state, IReadOnlyList<RandomEventData> events, IRandomSource random, out string eventTitle)
        {
            eventTitle = string.Empty;
            if (events == null || random == null)
            {
                return string.Empty;
            }

            for (int i = 0; i < events.Count; i++)
            {
                RandomEventData candidate = events[i];
                if (!candidate.CanTrigger(state))
                {
                    continue;
                }

                if (random.NextFloat() <= candidate.Chance)
                {
                    state.Stats.Add(candidate.Effects);
                    state.Stats.Clamp();
                    eventTitle = candidate.Title;
                    return "事件: " + candidate.Title + "。" + candidate.Message + BuildEffectSummary(candidate.Effects);
                }
            }

            return string.Empty;
        }

        private static void ApplyPressureRules(GameState state)
        {
            if (state.Stats.Stress >= 95)
            {
                state.Stats.Academics -= 4;
                state.Stats.Trust -= 2;
                state.Stats.Stress -= 12;
                state.Stats.Clamp();
                state.Log.Add("限界寸前で頭が回らない。少し休んでストレスは下がったが、勉強効率も落ちた。");
            }

            if (state.Stats.Stamina <= 3)
            {
                state.Stats.Face -= 3;
                state.Stats.Stress += 6;
                state.Stats.Clamp();
                state.Log.Add("足元がふらついた。番長も寝不足には勝てない。");
            }
        }

        private static string BuildEffectSummary(StatBlock effects)
        {
            var parts = new List<string>();
            AddPart(parts, "学力", effects.Academics);
            AddPart(parts, "人望", effects.Trust);
            AddPart(parts, "メンツ", effects.Face);
            AddPart(parts, "体力", effects.Stamina);
            AddPart(parts, "ストレス", effects.Stress);

            if (parts.Count == 0)
            {
                return string.Empty;
            }

            return " [" + string.Join(" / ", parts.ToArray()) + "]";
        }

        private static void AddPart(List<string> parts, string label, int value)
        {
            if (value == 0)
            {
                return;
            }

            string sign = value > 0 ? "+" : string.Empty;
            parts.Add(label + sign + value);
        }
    }
}
