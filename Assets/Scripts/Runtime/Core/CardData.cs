using System;

namespace JukenBancho.Core
{
    [Serializable]
    public sealed class CardData
    {
        public string Id;
        public string Title;
        public string Subtitle;
        public string FlavorText;
        public StatBlock Effects;
        public int MinStamina;
        public int UnlockTurn;
        public bool OneShot;
        public ActionTag Tag;

        public CardData(
            string id,
            string title,
            string subtitle,
            string flavorText,
            StatBlock effects,
            int minStamina,
            int unlockTurn,
            bool oneShot,
            ActionTag tag)
        {
            Id = id;
            Title = title;
            Subtitle = subtitle;
            FlavorText = flavorText;
            Effects = effects;
            MinStamina = minStamina;
            UnlockTurn = unlockTurn;
            OneShot = oneShot;
            Tag = tag;
        }

        public bool IsAvailable(GameState state)
        {
            if (state == null)
            {
                return false;
            }

            if (state.Turn < UnlockTurn)
            {
                return false;
            }

            if (state.Stats.Stamina < MinStamina)
            {
                return false;
            }

            if (OneShot && state.HasUsedCard(Id))
            {
                return false;
            }

            return true;
        }
    }
}
