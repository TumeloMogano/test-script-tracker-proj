using TestScriptTracker.Models.ViewModel;

namespace TestScriptTracker.Models.CombinedModels
{
    public class ClientThemeRequest
    {
        public ThemeViewModel Theme { get; set; }
        public LogoViewModel Logo { get; set; }
        public ColourSchemeViewModel ColourScheme { get; set; }
    }
}
