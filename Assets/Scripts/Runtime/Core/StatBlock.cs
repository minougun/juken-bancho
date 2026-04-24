using System;

namespace JukenBancho.Core
{
    [Serializable]
    public struct StatBlock
    {
        public int Academics;
        public int Trust;
        public int Face;
        public int Stamina;
        public int Stress;

        public StatBlock(int academics, int trust, int face, int stamina, int stress)
        {
            Academics = academics;
            Trust = trust;
            Face = face;
            Stamina = stamina;
            Stress = stress;
        }

        public static StatBlock Zero
        {
            get { return new StatBlock(0, 0, 0, 0, 0); }
        }

        public int Get(StatType type)
        {
            switch (type)
            {
                case StatType.Academics:
                    return Academics;
                case StatType.Trust:
                    return Trust;
                case StatType.Face:
                    return Face;
                case StatType.Stamina:
                    return Stamina;
                case StatType.Stress:
                    return Stress;
                default:
                    throw new ArgumentOutOfRangeException("type", type, "Unknown stat type.");
            }
        }

        public void Add(StatBlock other)
        {
            Academics += other.Academics;
            Trust += other.Trust;
            Face += other.Face;
            Stamina += other.Stamina;
            Stress += other.Stress;
        }

        public void Clamp()
        {
            Academics = Clamp01(Academics);
            Trust = Clamp01(Trust);
            Face = Clamp01(Face);
            Stamina = Clamp01(Stamina);
            Stress = Clamp01(Stress);
        }

        private static int Clamp01(int value)
        {
            if (value < 0)
            {
                return 0;
            }

            if (value > 100)
            {
                return 100;
            }

            return value;
        }
    }
}
