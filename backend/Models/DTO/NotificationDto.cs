namespace TestScriptTracker.Models.DTO
{
    public class NotificationDto
    {
        public Guid NotificationId { get; set; }
        public string NotificationTitle { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime NotificationDate { get; set; }
        public int NotificationTypeId { get; set; }
        public Guid? ProjectId { get; set; }
       
        //for the user:
        public Guid Id { get; set; }

        public string SenderName { get; set; }

        public string SenderSurname { get; set;  }


        public bool IsOpened { get; set; }
    }
}
