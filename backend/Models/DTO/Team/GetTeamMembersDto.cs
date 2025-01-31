namespace TestScriptTracker.Models.DTO.Team
{
    public class GetTeamMembersDto
    {
        public Guid TeamId { get; set; }
        public Guid UserId { get; set; }
        public bool IsTeamLead { get; set; }
        public string UserFirstName { get; set; }
        public string UserSurname { get; set; }
        public string UserContactNumber { get; set; }
        public string UserEmailAddress { get; set; }
    }
}
