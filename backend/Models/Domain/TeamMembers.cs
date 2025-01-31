using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("TeamMembers")]
    public class TeamMembers
    {
        [Key, Column(Order = 0)]
        public Guid TeamId { get; set; }
        [ForeignKey("TeamId")]
        public Team Team { get; set; }

        [Key, Column(Order = 1)]
        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public AppUser User { get; set; }
        public bool IsTeamLead { get; set; } = false;

        //public List<ScheduleEvent> ScheduleEvents { get; set; }
        public List<TestScriptAssignment> TestScriptAssignment { get; set; }
       // public List<ScheduleEventTeam> ScheduleEventTeams { get; set; }
    }
}
