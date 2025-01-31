using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("Clients")]
    public class Client
    {
        [Key]
        public Guid ClientId { get; set; }
        [MaxLength(30)]
        public string ClientName { get; set; } = string.Empty;
        [MaxLength(50)]
        public string ClientEmail { get; set; } = string.Empty;
        [MaxLength(10)]
        public string ClientNumber { get; set; } = string.Empty;
        [MaxLength(50)]
        public string ClientRegistrationNr { get; set; } = string.Empty;
        [MaxLength(6)]
        public string AddressStreetNumber { get; set; } = string.Empty;
        [MaxLength(30)]
        public string AddressStreetName { get; set; } = string.Empty;
        [MaxLength(5)]
        public string PostalCode { get; set; } = string.Empty;
        public DateTime CreationDate { get; set; }
        public bool IsDeleted { get; set; } = false;
        public int CityId { get; set; } //FK

        [ForeignKey("CityId")]
        public City City { get; set; }//(m:Clients, 1:City)
        public List<ClientRepresentative>? ClientRepresentatives { get; set; }//(1:Client, m:ClientReps)
        public List<Theme>? Themes { get; set; }//(1:Client, m:Themes)
        public List<Project>? Projects { get; set; }//(1:Client, m:Projects)

    }
}
