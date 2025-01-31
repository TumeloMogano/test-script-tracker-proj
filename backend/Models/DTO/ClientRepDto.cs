namespace TestScriptTracker.Models.DTO
{
    public class ClientRepDto
    {
        public Guid ClientRepId { get; set; }
        public string RepName { get; set; } = string.Empty;
        public string RepSurname { get; set; } = string.Empty;
        public string RepIDNumber { get; set; } = string.Empty;
        public string RepContactNumber { get; set; } = string.Empty;
        public string RepEmailAddress { get; set; } = string.Empty;
        public Guid ClientId { get; set; }
        public string ClientName { get; set; }
        public Guid? UserId { get; set; }
        
    }   
}
