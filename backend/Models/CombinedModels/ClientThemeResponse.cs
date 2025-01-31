using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Models.CombinedModels
{
    public class ClientThemeResponse
    {
        public Theme Theme { get; set; }
        public Logo Logo { get; set; }
        public ColourScheme ColourScheme { get; set; }
    }
}
