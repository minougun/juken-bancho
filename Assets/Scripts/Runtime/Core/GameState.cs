using System;
using System.Collections.Generic;

namespace JukenBancho.Core
{
    [Serializable]
    public sealed class GameState
    {
        public int Turn;
        public int TotalTurns;
        public StatBlock Stats;
        public bool IsComplete;
        public List<string> UsedCardIds = new List<string>();
        public List<string> Log = new List<string>();

        public static GameState CreateNew(int totalTurns, StatBlock initialStats)
        {
            var state = new GameState
            {
                Turn = 0,
                TotalTurns = totalTurns,
                Stats = initialStats,
                IsComplete = false,
                UsedCardIds = new List<string>(),
                Log = new List<string>()
            };
            state.Stats.Clamp();
            state.Log.Add("新学期。受験番長の戦いが始まった。");
            return state;
        }

        public GameState Clone()
        {
            return new GameState
            {
                Turn = Turn,
                TotalTurns = TotalTurns,
                Stats = Stats,
                IsComplete = IsComplete,
                UsedCardIds = new List<string>(UsedCardIds),
                Log = new List<string>(Log)
            };
        }

        public bool HasUsedCard(string cardId)
        {
            return UsedCardIds.Contains(cardId);
        }
    }
}
