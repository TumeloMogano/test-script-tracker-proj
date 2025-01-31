using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("Themes")]
    public class Theme
    {
        [Key]
        public Guid ThemeId { get; set; }
        [MaxLength(30)]
        public string ThemeName { get; set; } = string.Empty;
        public int FontSize { get; set; }
        public bool IsDeleted { get; set; } = false;
        public Guid ClientId { get; set; }//FK
        public int FontId { get; set; }//FK

        public Client? Client { get; set; }//(m:Theme, 1:Client)
        public Font? Font { get; set; }//(m:Themes, 1:Font)
        public List<Logo>? Logos { get; set; }//(1:Theme, m:Logos)
        public List<ColourScheme>? ColourSchemes { get; set; }//(1:Theme, m:ColourScheme)


    }
}
