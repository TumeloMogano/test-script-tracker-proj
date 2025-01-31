using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TestScriptTracker.Models.Domain
{
    [Table("ColourSchemes")]
    public class ColourScheme
    {
        [Key]
        public Guid ColourSchemeId { get; set; }
        [MaxLength(7)]
        public string Colour { get; set; } = string.Empty;
        public bool IsDeleted { get; set; } = false;
        public Guid ThemeId { get; set; }//FK

        [JsonIgnore]
        public Theme? Theme { get; set; }//Nav prop


    }
}
