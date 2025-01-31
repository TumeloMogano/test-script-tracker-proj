using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("Notifications")]
    public class Notification
    {
        [Key]
        public Guid NotificationId { get; set; }
        [MaxLength(50)]
        public string NotificationTitle { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime NotificationDate { get; set; }
        public bool IsDeleted { get; set; } = false;
        public Guid? ProjectId { get; set; }
        public int NotificationTypeId { get; set; }

        public Project? Project { get; set; }
        public NotificationType? NotificationType { get; set; }

        //For the user 
        public Guid Id { get; set; }
        public AppUser Users { get; set; }

        public string SenderName { get; set; }

        public string SenderSurname { get; set; } 

        //tracking if its opened or not 
        public bool IsOpened { get; set; }

    }
}
