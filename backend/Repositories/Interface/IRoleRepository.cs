using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Repositories.Interface
{
    public interface IRoleRepository
    {
        Task<IEnumerable<Role>> GetAllRolesAsync();
        Task<Role?> GetRoleByIdAsync(Guid roleid);
        Task<Role?> GetRoleWithPermissionAsync(Guid roleid);
        Task<Role> CreateRoleAsync(Role role);
        Task<Role?> UpdateRoleAsync(Role role);
        Task UpdateRolePermissionsAsync(Role role);
        Task<Role?> DeleteRoleAsync(Guid roleId);
        Task<bool> HasDependenciesAsync(Guid roleid);
        Task<bool> DeleteRolesAsync(Guid roleid);
        Task<IEnumerable<Role>> GetUserRolesByEmailAsync(string email);
        Task AssignUserToRoleAsync(Guid userId, string roleName);
        Task UnassignUserFromRoleAsync(Guid userId, string roleName);
    }
}
