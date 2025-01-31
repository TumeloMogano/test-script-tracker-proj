using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;


namespace TestScriptTracker.Models.Domain
{
    [Table("ScheduleEvents")]
    public class ScheduleEvent
    {
        [Key]
        public Guid ScheduleEventId { get; set; }

        [MaxLength(30)]
        public string ScheduleEventName { get; set; } = string.Empty;

        public DateTime ScheduleEventDate { get; set; }

        public TimeSpan EventTimeStart { get; set; }

        public TimeSpan EventTimeEnd { get; set; }

        public string EventDescription { get; set; } = string.Empty;

        public bool IsDeleted { get; set; } = false;

        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public AppUser User { get; set; }

        public Guid TeamId { get; set; }


        [JsonIgnore]
        public virtual ICollection<EventParticipants> EventParticipants { get; set; }
        // public ICollection<ScheduleEventTeam> ScheduleEventTeams { get; set; }
    }
}
