namespace TestScriptTracker.Models.ViewModel
{
    public class TeamMemberViewModel
    {
        public Guid TeamId { get; set; }
        public Guid UserId { get; set; }

        public Guid Id { get; set; }

        public bool IsTeamLead { get; set; } = false;

    }
}
