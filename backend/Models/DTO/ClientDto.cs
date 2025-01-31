using System.ComponentModel.DataAnnotations.Schema;
using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Models.DTO
{
    public class ClientDto
    {
        public Guid ClientId { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public string ClientEmail { get; set; } = string.Empty;
        public string ClientNumber { get; set; } = string.Empty;
        public string ClientRegistrationNr { get; set; } = string.Empty;
        public string AddressStreetNumber { get; set; } = string.Empty;
        public string AddressStreetName { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public int CityId { get; set; }
        public string CityName { get; set; } = string.Empty;
        public int RegionId { get; set; } 
        public string Region { get; set; } = string.Empty;
        public int CountryId {  get; set; } 
        public string Country { get; set; } = string.Empty;
    }
}
