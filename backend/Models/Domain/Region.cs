using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("Regions")]
    public class Region
    {
        [Key]
        public int RegionId { get; set; }
        [MaxLength(50)]
        public string RegionName { get; set; } = string.Empty;
        public int CountryId { get; set; }//FK

        public List<City> Cities { get; set; } //(1:Region, m:Cities)
        public Country Country { get; set; } //(m:region, 1:country)

    }
}
