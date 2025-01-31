using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.DTO;

namespace TestScriptTracker.Models.CombinedModels
{
    public class ThemeDetails
    {
        public ThemeDto Theme { get; set; }
        public List<Logo> ThemeLogos { get; set; }
        public List<ColourScheme> ThemeColourSchemes { get; set; }
    }
}
