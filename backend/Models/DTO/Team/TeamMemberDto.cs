namespace TestScriptTracker.Models.DTO.Team
{
    public class TeamMemberDto
    {
        public Guid TeamId { get; set; }
        public Guid UserId { get; set; }
        public bool IsTeamLead { get; set; } = false;
    }
}
