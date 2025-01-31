using System.ComponentModel.DataAnnotations;
using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Models.ViewModel
{
    public class ThemeViewModel
    {
        public string ThemeName { get; set; } = string.Empty;
        public int FontSize { get; set; }
        [Required]
        public Guid ClientId { get; set; }//FK
        [Required]
        public int FontId { get; set; }//FK
    }
}
