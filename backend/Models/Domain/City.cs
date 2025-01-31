using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("Cities")]
    public class City
    {
        [Key]
        public int CityId { get; set; }
        [MaxLength(150)]
        public string CityName { get; set; } = string.Empty;
        public int RegionId { get; set; }
        
        public List<Client>? Clients { get; set; }
        public Region? Regions { get; set; }
    }
}
