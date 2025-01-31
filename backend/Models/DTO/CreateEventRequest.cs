using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Models.DTO
{
    public class CreateEventRequest
    {
        public ScheduleEvent ScheduleEvent { get; set; }

        // public List<string> Ids { get; set; }

       // public List<Guid> TeamIds { get; set; }
    }
}
