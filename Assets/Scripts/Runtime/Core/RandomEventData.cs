using System;

namespace JukenBancho.Core
{
    [Serializable]
    public sealed class RandomEventData
    {
        public string Id;
        public string Title;
        public string Message;
        public StatBlock Effects;
        public int MinTurn;
        public float Chance;
        public StatType? GateStat;
        public int GateBelowOrEqual;

        public RandomEventData(
            string id,
            string title,
            string message,
            StatBlock effects,
            int minTurn,
            float chance,
            StatType? gateStat,
            int gateBelowOrEqual)
        {
            Id = id;
            Title = title;
            Message = message;
            Effects = effects;
            MinTurn = minTurn;
            Chance = chance;
            GateStat = gateStat;
            GateBelowOrEqual = gateBelowOrEqual;
        }

        public bool CanTrigger(GameState state)
        {
            if (state == null || state.Turn < MinTurn)
            {
                return false;
            }

            if (GateStat.HasValue && state.Stats.Get(GateStat.Value) > GateBelowOrEqual)
            {
                return false;
            }

            return true;
        }
    }
}
