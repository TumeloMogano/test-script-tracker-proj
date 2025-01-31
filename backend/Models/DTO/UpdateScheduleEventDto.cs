namespace TestScriptTracker.Models.DTO
{
    public class UpdateScheduleEventDto
    {
        public string ScheduleEventName { get; set; }
        public DateTime ScheduleEventDate { get; set; }

        public TimeSpan EventTimeStart { get; set; }

        public TimeSpan EventTimeEnd { get; set; }
        public string EventDescription { get; set; }
    }
}
