namespace TestScriptTracker.Models.DTO
{
    public class ScheduleEventDto
    {
       // public Guid ScheduleEventId { get; set; }

        public string ScheduleEventName { get; set; }

        public string EventDescription { get; set; }

        public DateTime ScheduleEventDate { get; set; }

        public TimeSpan EventTimeStart { get; set; }

        public TimeSpan EventTimeEnd { get; set; }


         public Guid UserId { get; set; }

        //  public bool IsDeleted { get; set; }

        public Guid TeamId { get; set; }


    }
}
