namespace TestScriptTracker.Models.ViewModel
{
    public class CreateScheduleEventViewModel
    {
        public Guid ScheduleEventId { get; set; }
        public string ScheduleEventName { get; set; }

        public string EventDescription { get; set; }

        public DateTime ScheduleEventDate { get; set; }

        public TimeSpan ScheduleEventTime { get; set; }
       // public string AppUserId { get; set; }
       // public List<TeamMemberViewModel> TeamMembers { get; set; }

    }
}
