using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Models.DTO
{
    public class ThemeDto
    {
        public Guid ThemeId { get; set; }
        public string ThemeName { get; set; } = string.Empty;
        public int FontSize { get; set; }

        public Guid ClientId { get; set; }//FK

        //relationship (m:Themes, 1:Font)
        public int FontId { get; set; }//FK
    }
}
