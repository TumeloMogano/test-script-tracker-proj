namespace TestScriptTracker.Models.DTO
{
    public class TeamMembersDto
    {
        public Guid TeamId { get; set; }
        public Guid UserId { get; set; }

        public string UserFirstName { get; set; }
    }
}
