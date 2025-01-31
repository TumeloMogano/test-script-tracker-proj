namespace TestScriptTracker.Models.DTO.Team
{
    public class UserDetailsDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string IdNumber { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;

    }
}
