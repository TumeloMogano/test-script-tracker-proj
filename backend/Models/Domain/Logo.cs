using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TestScriptTracker.Models.Domain
{
    [Table("Logos")]
    public class Logo
    {
        [Key]
        public Guid LogoId { get; set; }
        public string LogoImage { get; set; } = string.Empty;
        public Guid ThemeId { get; set; }//FK
        public bool IsDeleted { get; set; } = false;

        [JsonIgnore]
        public Theme? Theme { get; set; }//nav prop

    }
}
