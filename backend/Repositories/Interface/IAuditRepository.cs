using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Repositories.Interface
{
    public interface IAuditRepository
    {
        Task AddAuditLog(AuditLog auditLog);
        Task<IEnumerable<AuditLog>> GetAuditLogs();
    }
}
