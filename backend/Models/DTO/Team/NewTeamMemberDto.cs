namespace TestScriptTracker.Models.DTO.Team
{
    public class NewTeamMemberDto
    {
        public Guid UserId { get; set; }
        public bool IsTeamLead { get; set; }
    }
}
