namespace TestScriptTracker.Models.DTO
{
    public class LogoDto
    {
        public Guid LogoId { get; set; }
        public string LogoImage { get; set; } = string.Empty;
        public Guid ThemeId { get; set; }//FK
    }
}
