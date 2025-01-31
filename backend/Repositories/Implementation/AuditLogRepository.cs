using TestScriptTracker.Data;
using Microsoft.EntityFrameworkCore;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Repositories.Interface;

namespace TestScriptTracker.Repositories.Implementation
{
    public class AuditLogRepository : IAuditRepository
    {
        private readonly AppDbContext _dbContext;

        public AuditLogRepository(AppDbContext context)
        {
            _dbContext = context;
        }

        public async Task AddAuditLog(AuditLog auditLog)
        {
            _dbContext.AuditLog.AddAsync(auditLog);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<AuditLog>> GetAuditLogs()
        {
            return await _dbContext.AuditLog.ToListAsync();
        }
    }
}
