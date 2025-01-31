namespace TestScriptTracker.Models.DTO
{
    public class ColourSchemeDto
    {
        public Guid ColourSchemeId { get; set; }
        public string Colour { get; set; } = string.Empty;
        public Guid ThemeId { get; set; }//FK
    }
}
