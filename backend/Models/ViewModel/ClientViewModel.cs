namespace TestScriptTracker.Models.ViewModel
{
    public class ClientViewModel
    {
        //public Guid ClientId { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public string ClientEmail { get; set; } = string.Empty;
        public string ClientNumber { get; set; } = string.Empty;
        public string ClientRegistrationNr { get; set; } = string.Empty;
        public string AddressStreetNumber { get; set; } = string.Empty;
        public string AddressStreetName { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public int CityId { get; set; }
    }
}
