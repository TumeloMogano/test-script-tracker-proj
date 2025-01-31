using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Repositories.Interface
{
    public interface IPermissionRepository
    {
        Task<IEnumerable<Permission>> GetAllPermissionsAsync();
    }
}
