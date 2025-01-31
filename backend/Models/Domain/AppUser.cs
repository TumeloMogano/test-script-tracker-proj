using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    public class AppUser : IdentityUser<Guid>
    {
        [MaxLength(30)]
        public string UserFirstName { get; set; } = string.Empty;
        [MaxLength(30)]
        public string UserSurname { get; set; } = string.Empty;
        [MaxLength(13)]
        public string UserIDNumber { get; set; } = string.Empty;
        [MaxLength(10)]
        public string UserContactNumber { get; set; } = string.Empty;
        [MaxLength(30)]
        public string UserEmailAddress { get; set; } = string.Empty;
        [MaxLength(30)]
        public string NormalizedEmail { get; set; } = string.Empty;
        [MaxLength(30)]
        public string Email { get; set; } = string.Empty;
        public string? PasswordHash { get; set; } = string.Empty;
        //public DateTime? PasswordHashExpiration { get; set; } = DateTime.UtcNow;
        public DateTime? RegistrationDate { get; set; } = DateTime.Now;
        [MaxLength(30)]
        public string? RegistrationCode { get; set; } = string.Empty;
        [MaxLength(255)]
        //public string TemplateCreation { get; set; } = string.Empty;
        public bool? IsNewPassword { get; set; } = false;

        public int? ResetCode { get; set; }
        public DateTime? ResetCodeExpiration { get; set; }
        public bool IsDeleted { get; set; } = false;
        public int RegStatusId { get; set; } //FK

        [ForeignKey("RegStatusId")]
        public RegistrationStatus? RegistrationStatus { get; set; }
        public ClientRepresentative? ClientRepresentative { get; set; }//Nav prop
        public List<AuditLog> AuditLogs { get; set; }
        public List<DownloadReportHistory> DownloadReportHistory { get; set; }
        public List<TeamMembers> TeamMembers { get; set; }


        public ICollection<ScheduleEvent> ScheduleEvents { get; set; }

        public virtual ICollection<EventParticipants> EventParticipants { get; set; } = new List<EventParticipants>();


        //for the schedule event 
        // public ICollection<ScheduleEvent> ScheduleEvents { get; set; } = new List<ScheduleEvent>();
        //public ICollection<ScheduleEventTeam> ScheduleEventTeams { get; set; }

    }
}
