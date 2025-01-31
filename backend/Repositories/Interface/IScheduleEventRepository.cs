using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Repositories.Interface
{
    public interface IScheduleEventRepository
    {
        //Task<ScheduleEvent> CreateScheduleEventAsync(ScheduleEvent scheduleEvent);

        Task<ScheduleEvent> CreateScheduleEventAsync(ScheduleEvent scheduleEvent, List<Guid> teamMemberIds);

        Task<IEnumerable<ScheduleEvent?>> GetsAllScheduleEvents();
        Task<ScheduleEvent> GetScheduleEventByIdAsync(Guid scheduleEventId);

        Task UpdateScheduleEventAsync(ScheduleEvent scheduleEvent);

        //Task RemoveScheduleEventAsync (ScheduleEvent scheduleEvent);
        Task RemoveScheduleEventAsync(Guid scheduleEventId);

        Task SoftDeleteScheduleEventAsync(Guid scheduleEventId);

        Task<Team[]> GetAllTeamsAsync();

    }
}
