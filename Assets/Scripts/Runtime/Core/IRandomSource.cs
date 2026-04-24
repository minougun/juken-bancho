using System;

namespace JukenBancho.Core
{
    public interface IRandomSource
    {
        float NextFloat();
    }

    public sealed class SystemRandomSource : IRandomSource
    {
        private readonly Random random;

        public SystemRandomSource()
            : this(Environment.TickCount)
        {
        }

        public SystemRandomSource(int seed)
        {
            random = new Random(seed);
        }

        public float NextFloat()
        {
            return (float)random.NextDouble();
        }
    }

    public sealed class FixedRandomSource : IRandomSource
    {
        private readonly float value;

        public FixedRandomSource(float value)
        {
            this.value = value;
        }

        public float NextFloat()
        {
            return value;
        }
    }
}
