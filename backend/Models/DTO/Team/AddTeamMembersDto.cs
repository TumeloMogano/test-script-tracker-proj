namespace TestScriptTracker.Models.DTO.Team
{
    public class AddTeamMembersDto
    {
        public Guid TeamId { get; set; }
        public List<NewTeamMemberDto> TeamMembers { get; set; } = new List<NewTeamMemberDto>();
    }
}
