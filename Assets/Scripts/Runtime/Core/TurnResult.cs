namespace JukenBancho.Core
{
    public sealed class TurnResult
    {
        public bool Success;
        public string Message;
        public string EventTitle;
        public GameState State;

        public static TurnResult Failure(GameState state, string message)
        {
            return new TurnResult
            {
                Success = false,
                Message = message,
                EventTitle = string.Empty,
                State = state
            };
        }

        public static TurnResult Ok(GameState state, string message, string eventTitle)
        {
            return new TurnResult
            {
                Success = true,
                Message = message,
                EventTitle = eventTitle,
                State = state
            };
        }
    }
}
