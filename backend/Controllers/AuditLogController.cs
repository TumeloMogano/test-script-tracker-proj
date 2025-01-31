using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestScriptTracker.Data;
using Microsoft.EntityFrameworkCore;


namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditLogController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public AuditLogController (AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }


       
        [HttpGet]
        public async Task<IActionResult> GetAuditLogs(
         //[FromQuery] Guid? userId = null,
         [FromQuery] string? firstName = null,
         [FromQuery] string? surname = null,
         [FromQuery] int? actionId = null,
         [FromQuery] string? actionName = null,
         [FromQuery] DateTime? startDate = null,
         [FromQuery] DateTime? endDate = null)
        {

            //var query = _dbContext.AuditLog.Include(al => al.Action).AsQueryable();
            //to get users name and surname
            var query = _dbContext.AuditLog
            .Include(al => al.Action)
            .Include(al => al.User) 
            .AsQueryable();

            //searching using their firstname or surname
            if (!string.IsNullOrEmpty(firstName))
            {
                query = query.Where(al => al.User.UserFirstName.Contains(firstName));
            }

            if (!string.IsNullOrEmpty(surname))
            {
                query = query.Where(al => al.User.UserSurname.Contains(surname));
            }

            if (!string.IsNullOrEmpty(actionName))
            {
                query = query.Where(al => al.Action.ActionName == actionName);
            }

            if (startDate.HasValue)
            {
                query = query.Where(al => al.TimeStamp >= startDate);
            }

            if (endDate.HasValue)
            {
                query = query.Where(al => al.TimeStamp <= endDate);
            }

            var auditLogs = await query
                .Select(al => new
                {
                    al.LogId,
                    al.TimeStamp,
                    al.ActionId,
                    //to help with getting user name and surname 
                    UserName = al.User != null ? al.User.UserFirstName + " " + al.User.UserSurname : "Unknown User",
                    // al.UserId,
                    ActionName = al.Action != null ? al.Action.ActionName : "Unknown", 
                    al.TableName,
                    OldValues = al.OldValues ?? "N/A", 
                    NewValues = al.NewValues ?? "N/A",
                    AffectedColumns = al.AffectedColumns ?? "N/A", 
                    al.PrimaryKey,
                })
                .ToListAsync();

            return Ok(auditLogs);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuditLog(Guid id)
        {
            var auditLog = await _dbContext.AuditLog
                .Include(al => al.Action)
                .FirstOrDefaultAsync(al => al.LogId == id);

            if (auditLog == null)
            {
                return NotFound();
            }

            return Ok(auditLog);
        }

        [HttpGet("filter")]
        public async Task<IActionResult> GetFilteredAuditLogs(Guid? userId, int? actionId, DateTime? startDate, DateTime? endDate)
        {
            var query = _dbContext.AuditLog.Include(a => a.Action).AsQueryable();

            if (userId.HasValue)
            {
                query = query.Where(a => a.UserId == userId.Value);
            }

            if (actionId.HasValue)
            {
                query = query.Where(a => a.ActionId == actionId.Value);
            }

            if (startDate.HasValue)
            {
                query = query.Where(a => a.TimeStamp >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(a => a.TimeStamp <= endDate.Value);
            }

            var auditLogs = await query.ToListAsync();
            return Ok(auditLogs);
        }

    }
}
