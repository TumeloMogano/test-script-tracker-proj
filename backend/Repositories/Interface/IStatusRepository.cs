using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Repositories.Interface
{
    public interface IStatusRepository
    {
        Task<Status> CreateStatus(Status status);
        Task<IEnumerable<Status>> GetAllStatusesAsync();
        Task<Status?> GetStatusByIdAsync(Guid statusid);
        Task<Status?> UpdateStatusAsync(Status status);
        Task<string> DeleteStatusAsync(Guid statusid);
        Task<IEnumerable<StatusType>> GetAllStatusTypesAsync();
    }
}