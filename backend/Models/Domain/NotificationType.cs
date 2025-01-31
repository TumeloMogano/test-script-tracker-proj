using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("NotificationTypes")]
    public class NotificationType
    {
        [Key]
        public int NotificationTypeId { get; set; }
        [MaxLength(50)]
        public string NotificationTypeName { get; set; } = string.Empty;
        public List<Notification>? Notifications { get; set; }
    }
}
