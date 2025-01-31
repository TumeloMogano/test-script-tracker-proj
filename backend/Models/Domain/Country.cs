using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("Countries")]
    public class Country
    {
        [Key]
        public int CountryId { get; set; }
        [MaxLength(50)]
        public string CountryName { get; set; } = string.Empty;
        public List<Region> Regions { get; set; }
    }
}
