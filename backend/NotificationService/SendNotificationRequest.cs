using System.ComponentModel.DataAnnotations;

namespace TestScriptTracker.NotificationService
{
    public class SendNotificationRequest
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Message { get; set; }
    }
}
