using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Repositories.Interface;

namespace TestScriptTracker.Repositories.Implementation
{
    public class RoleRepository : IRoleRepository
    {
        private readonly RoleManager<Role> roleManager;
        private readonly UserManager<AppUser> userManager;
        private readonly AppDbContext dbContext;

        public RoleRepository(RoleManager<Role> roleManager,
            UserManager<AppUser> userManager,
            AppDbContext dbContext)
        {
            this.roleManager = roleManager;
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        public async Task<Role> CreateRoleAsync(Role role)
        {
            var result = await roleManager.CreateAsync(role);

            if (result.Succeeded)
            {
                return role;
            }

            throw new InvalidOperationException("Failed to create role");
        }
        public async Task<IEnumerable<Role>> GetAllRolesAsync()
        {
            return await roleManager.Roles
                .Where(t => t.IsDeleted == false)
                .ToListAsync();
        }
        public async Task<Role?> GetRoleByIdAsync(Guid roleid)
        {
            var role = await roleManager.FindByIdAsync(roleid.ToString());

            if (role == null)
            {
                return null;
            }

            return role;
        }
        public async Task<Role?> GetRoleWithPermissionAsync(Guid roleid)
        {
            var role = await dbContext.Roles
                .Include(r => r.RolePermissions)
                    .ThenInclude(rp => rp.Permission)
                    .FirstOrDefaultAsync(p => p.Id == roleid);

            if (role == null)
            {
                return null;
            }

            return role;
        }
        public async Task<Role?> UpdateRoleAsync(Role role)
        {
            var existingRole = await roleManager.FindByIdAsync(role.Id.ToString());

            if (existingRole == null)
            {
                return null;
            }

            existingRole.Name = role.Name;
            existingRole.NormalizedName = role.NormalizedName;
            existingRole.RoleDescription = role.RoleDescription;

            var result = await roleManager.UpdateAsync(existingRole);

            if (result.Succeeded)
            {
                return existingRole;
            }

            throw new InvalidOperationException("Failed to update role");

        }
        public async Task UpdateRolePermissionsAsync(Role role)
        {
            await roleManager.UpdateAsync(role);
        }
        public async Task<Role?> DeleteRoleAsync(Guid roleId)
        {
            var role = await roleManager.FindByIdAsync(roleId.ToString());

            if (role == null)
            {
                return null;
            }

            await roleManager.DeleteAsync(role);
            return role;
        }

        public async Task<IEnumerable<Role>> GetUserRolesByEmailAsync(string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return Enumerable.Empty<Role>();
            }

            var roles = await userManager.GetRolesAsync(user);
            return await dbContext.Roles.Where(r => roles.Contains(r.Name)).ToListAsync();
        }

        public async Task AddUserToRoleAsync(Guid userId, Guid roleId)
        {
            var user = await userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            var role = await roleManager.FindByIdAsync(roleId.ToString());
            if (role == null)
            {
                throw new InvalidOperationException("Role not found");
            }

            var result = await userManager.AddToRoleAsync(user, role.Name!);
            if (!result.Succeeded)
            {
                throw new InvalidOperationException("Failed to assign user to role");
            }
        }

        public async Task AssignUserToRoleAsync(Guid userId, string roleName)
        {
            var user = await userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            var result = await userManager.AddToRoleAsync(user, roleName);
            if (!result.Succeeded)
            {
                throw new InvalidOperationException("Failed to assign role to user");
            }
        }

        public async Task UnassignUserFromRoleAsync(Guid userId, string roleName)
        {
            var user = await userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                throw new InvalidOperationException("User Not Found");
            }

            var result = await userManager.RemoveFromRoleAsync(user, roleName);
            if (!result.Succeeded)
            {
                throw new InvalidOperationException("Failed to unassign role from user");
            }
        }

        public async Task<bool> HasDependenciesAsync(Guid roleid)
        {
            var hasDependencies = await dbContext.UserRoles.AnyAsync(ur => ur.RoleId == roleid) ||
                await dbContext.RolePermissions.AnyAsync(rp =>  rp.RoleId == roleid);

            return hasDependencies;
        }

        public async Task<bool> DeleteRolesAsync(Guid roleid)
        {
            var role = await dbContext.Roles.FindAsync(roleid);

            if (role == null)
            {
                return false;
            }

            dbContext.Roles.Remove(role);
            await dbContext.SaveChangesAsync();
            return true;
        }
    }
}
