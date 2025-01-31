using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using SkiaSharp;
using System.Linq;
using System.Security.Claims;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.DTO;
using TestScriptTracker.Models.DTO.Team;
using TestScriptTracker.Models.ViewModel;
using TestScriptTracker.Repositories.Implementation;
using TestScriptTracker.Repositories.Interface;

namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleEventsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        public readonly IScheduleEventRepository _scheduleEventRepository;
        private readonly IAuditRepository _auditRepository;

        public ScheduleEventsController(AppDbContext dbContext, IScheduleEventRepository scheduleEventRepository, IAuditRepository auditRepository)
        {
            _dbContext = dbContext;
            this._scheduleEventRepository = scheduleEventRepository;
            _auditRepository = auditRepository;
        }

        [HttpPost("CreateScheduleEvent")]
        public async Task<IActionResult> CreateScheduleEvent([FromBody] ScheduleEventDto dto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized("User ID is missing or invalid.");
            }

            if (!Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized("User ID is invalid.");
            }

            // Create the ScheduleEvent object
            var scheduleEvent = new ScheduleEvent
            {
                ScheduleEventId = Guid.NewGuid(),
                ScheduleEventName = dto.ScheduleEventName,
                EventDescription = dto.EventDescription,
                ScheduleEventDate = dto.ScheduleEventDate,
                EventTimeStart = dto.EventTimeStart,
                EventTimeEnd = dto.EventTimeEnd,
                IsDeleted = false,
                /*UserId = Guid.Parse(userIdString)*/
                UserId = userId,
                TeamId = dto.TeamId
            };

            // Add the event to the database
            _dbContext.ScheduleEvents.Add(scheduleEvent);

            // Get all users in the selected team
            var teamMembers = await _dbContext.TeamMembers
                .Where(tm => tm.TeamId == dto.TeamId)
                .Select(tm => tm.UserId)
                .ToListAsync();

            // Associate the event with all team members
            foreach (var memberId in teamMembers)
            {
                var eventParticipant = new EventParticipants
                {
                    EventParticipantId = Guid.NewGuid(),
                    ScheduleEventId = scheduleEvent.ScheduleEventId,
                    UserId = memberId
                };
                _dbContext.EventParticipants.Add(eventParticipant);
            }
            var auditLog = new AuditLog
            {
                ActionId = 1, // 1 for Create action
                UserId = userId, // The user who performed the action
                TimeStamp = DateTime.UtcNow,
                TableName = "ScheduleEvents",
                NewValues = JsonConvert.SerializeObject(dto),
                PrimaryKey = scheduleEvent.ScheduleEventId.ToString()
            };

            await _auditRepository.AddAuditLog(auditLog);

            try
            {
                await _dbContext.SaveChangesAsync();
                return Ok(scheduleEvent);
            }
            catch (Exception ex)
            {
                // Handle exceptions (log them, etc.)
                return StatusCode(500, "An error occurred while creating the event.");
            }
        }

        //Get all schedule events
        [HttpGet("GetsAllScheduleEvent")]
        public async Task<IActionResult> GetsAllScheduleEvents()
        {

            try
            {
                var scheduleEvents = await _scheduleEventRepository.GetsAllScheduleEvents();
                return Ok(scheduleEvents);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        // Read a ScheduleEvent by ID
        [HttpGet("GetScheduleEvent/{scheduleEventId}")]
        public async Task<IActionResult> GetScheduleEvent(Guid scheduleEventId)
        {
            var scheduleEvent = await _scheduleEventRepository.GetScheduleEventByIdAsync(scheduleEventId);

            if (scheduleEvent == null)
            {
                return NotFound("Schedule event not found.");
            }

            return Ok(scheduleEvent);
        }

        //// Update a ScheduleEvent
        [HttpPut("UpdateScheduleEvent/{scheduleEventId}")]
        public async Task<IActionResult> UpdateScheduleEvent(Guid scheduleEventId, UpdateScheduleEventDto updateEvent)
        {
            try
            {
                var scheduleEvent = await _scheduleEventRepository.GetScheduleEventByIdAsync(scheduleEventId);
                if (scheduleEvent == null)
                {
                    return NotFound("schedule event not found");
                }

                scheduleEvent.ScheduleEventName =updateEvent.ScheduleEventName;
                scheduleEvent.EventDescription = updateEvent.EventDescription;
                scheduleEvent.ScheduleEventDate =updateEvent.ScheduleEventDate;
                scheduleEvent.EventTimeStart = updateEvent.EventTimeStart;
                scheduleEvent.EventTimeEnd = updateEvent.EventTimeEnd;


                await _scheduleEventRepository.UpdateScheduleEventAsync(scheduleEvent)
 ;
                return Ok(scheduleEvent);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }


        // Delete a ScheduleEvent
        [HttpDelete("DeleteScheduleEvent/{scheduleEventId}")]
       public async Task<IActionResult> RemoveScheduleEventAsync(Guid scheduleEventId)
        {
            if (scheduleEventId == Guid.Empty)
            {
                return BadRequest("Invalid scheduleEventId");
            }

            try
            {
                // var scheduleEvent = await  _scheduleEventRepository.GetScheduleEventByIdAsync(scheduleEventId);
                var scheduleEvent = await _dbContext.ScheduleEvents.FindAsync(scheduleEventId);
                if (scheduleEvent == null)
                {
                    return NotFound("schedule event not found");
                }

                // await _scheduleEventRepository.RemoveScheduleEventAsync(scheduleEventId);
                await _scheduleEventRepository.SoftDeleteScheduleEventAsync(scheduleEventId);

                return Ok(); // Return 200 OK status
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting schedule event: {ex.Message}");
                return BadRequest($"Invalid transaction: {ex.Message}");
            }
        }


        [HttpGet]
        [Route("GetAllTeams")]
        public async Task<IActionResult> GetAllTeams()
        {
            try
            {
                //Retrieve list from repository
                var teams = await _scheduleEventRepository.GetAllTeamsAsync();

                return Ok(teams);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpGet("GetEventsForUser")]
        public async Task<IActionResult> GetEventsForUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID is missing or invalid.");
            }

            // Fetch all events where the user is a participant
            var events = await _dbContext.EventParticipants
                .Where(ep => ep.UserId == Guid.Parse(userId) && ep.ScheduleEvent.IsDeleted == false)
                .Select(ep => ep.ScheduleEvent)
                .ToListAsync(); // This should return a list (array)

            if (events == null || events.Count == 0)
            {
                return NotFound("No events found for this user.");
            }

            return Ok(events); // Returning the list (array) of events
        }



    }
}
