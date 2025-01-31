using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization;


namespace TestScriptTracker.Models.Domain
{
    public class EventParticipants
    {
        [Key]
        public Guid EventParticipantId { get; set; }

        public Guid ScheduleEventId { get; set; }  // Foreign Key to ScheduleEvent

        [ForeignKey("ScheduleEventId")]

        [JsonIgnore]
        public  ScheduleEvent ScheduleEvent { get; set; }  // Navigation property to ScheduleEvent

        public Guid UserId { get; set; }  // Foreign Key to User

        [ForeignKey("UserId")]
        public virtual AppUser User { get; set; }
    }
}
