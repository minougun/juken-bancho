using UnityEngine;

namespace JukenBancho.UI
{
    public static class JukenBanchoBootstrap
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Boot()
        {
            Screen.orientation = ScreenOrientation.Portrait;

            if (Object.FindObjectOfType<JukenBanchoGamePresenter>() != null)
            {
                return;
            }

            var host = new GameObject("JukenBanchoRuntime");
            Object.DontDestroyOnLoad(host);
            host.AddComponent<JukenBanchoGamePresenter>();
        }
    }
}
