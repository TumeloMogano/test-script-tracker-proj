using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using SkiaSharp;
using Newtonsoft.Json;

namespace TestScriptTracker.Repositories.Implementation
{
    public class ScheduleEventRepository : IScheduleEventRepository
    {
        private readonly AppDbContext _dbContext;
        public ScheduleEventRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        //create new schedule event
        //public async Task<ScheduleEvent> CreateScheduleEventAsync(ScheduleEvent scheduleEvent)
        //{
        //    await _dbContext.ScheduleEvents.AddAsync(scheduleEvent);
        //    await _dbContext.SaveChangesAsync();

        //    return scheduleEvent;
        //}
        public async Task<ScheduleEvent> CreateScheduleEventAsync(ScheduleEvent scheduleEvent, List<Guid> teamMemberIds)
        {
            // Add the event to the context
            await _dbContext.ScheduleEvents.AddAsync(scheduleEvent);

            // Create EventParticipants for each team member
            foreach (var memberId in teamMemberIds)
            {
                var eventParticipant = new EventParticipants
                {
                    EventParticipantId = Guid.NewGuid(),
                    ScheduleEventId = scheduleEvent.ScheduleEventId,
                    UserId = memberId
                };
                await _dbContext.EventParticipants.AddAsync(eventParticipant);
            }

            // Save changes to the database
            await _dbContext.SaveChangesAsync();

        

            return scheduleEvent;
        }


        //get all events 
        public async Task<IEnumerable<ScheduleEvent?>> GetsAllScheduleEvents()
        {
            return await _dbContext.ScheduleEvents.ToListAsync();
        }

        //get event by id
        public async Task<ScheduleEvent> GetScheduleEventByIdAsync(Guid scheduleEventId)
        {
            return await _dbContext.ScheduleEvents.FirstOrDefaultAsync(s => s.ScheduleEventId ==scheduleEventId);
        }


        //update schedule event 
        public async Task UpdateScheduleEventAsync(ScheduleEvent scheduleEvent)
        {
            _dbContext.Entry(scheduleEvent).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
        }

        //delete schedule event 
        //public async Task RemoveScheduleEventAsync(ScheduleEvent scheduleEvent)
        //{
        //    _dbContext.ScheduleEvents.Remove(scheduleEvent);
        //    await _dbContext.SaveChangesAsync();
        //}
        public async Task RemoveScheduleEventAsync(Guid scheduleEventId)
        {
            //var scheduleEvent = await _dbContext.ScheduleEvents.FindAsync(scheduleEventId);
            //if (scheduleEvent != null)
            //{
            //    _dbContext.ScheduleEvents.Remove(scheduleEvent);
            //    await _dbContext.SaveChangesAsync();
            //}
            //else
            //{
            //    throw new Exception("Schedule event not found");
            //}
            var participants = _dbContext.EventParticipants.Where(p => p.ScheduleEventId == scheduleEventId).ToList();
            _dbContext.EventParticipants.RemoveRange(participants);

            // Now remove the ScheduleEvent
            var scheduleEvent = await _dbContext.ScheduleEvents.FindAsync(scheduleEventId);
            if (scheduleEvent != null)
            {
                _dbContext.ScheduleEvents.Remove(scheduleEvent);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task SoftDeleteScheduleEventAsync(Guid scheduleEventId)
        {
            var scheduleEvent = await _dbContext.ScheduleEvents.FindAsync(scheduleEventId);
            if (scheduleEvent != null)
            {
                scheduleEvent.IsDeleted = true;
                await _dbContext.SaveChangesAsync();
            }
        }


        public async Task<Team[]> GetAllTeamsAsync()
        {
            return await _dbContext.Teams.ToArrayAsync();
        }


    }
}
