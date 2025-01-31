using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("Fonts")]
    public class Font
    {
        [Key]
        public int FontId { get; set; }
        [MaxLength(50)]
        public string FontName { get; set; } = string.Empty;
        public List<Theme>? Themes { get; set; }
    }
}
