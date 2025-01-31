namespace TestScriptTracker.Models.DTO
{
    public class CreateScheduleEventDto
    {
        public string ScheduleEventName { get; set; }
        public DateTime ScheduleEventDate { get; set; }
        public TimeSpan ScheduleEventTime { get; set; }
        public string EventDescription { get; set; }
        public Guid UserId { get; set; }
        public Guid TeamId { get; set; }
       
    }
}
