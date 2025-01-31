using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Shared.Authorization;

namespace TestScriptTracker.Factory
{
    public class AppUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<AppUser, Role>
    {
        public AppUserClaimsPrincipalFactory(UserManager<AppUser> userManager,
            RoleManager<Role> roleManager,
            IOptions<IdentityOptions> optionsAccessor)
            : base(userManager, roleManager, optionsAccessor)
        { }

        protected override async Task<ClaimsIdentity> GenerateClaimsAsync(AppUser user)
        {
            //Generate default claims identity
            var identity = await base.GenerateClaimsAsync(user);

            //Get user's roles
            var userRoleNames = await UserManager.GetRolesAsync(user) ?? Array.Empty<string>();

            //Fetch roles from the database
            var userRoles = await RoleManager.Roles
                .Include(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
                .Where(r => userRoleNames.Contains(r.Name!))
                .ToListAsync();

            //Initialize user permissions
            var userPermissions = Permissions.None;

            //Combine permissions from all user roles
            foreach (var role in userRoles)
            {
                foreach (var rolePermission in role.RolePermissions)
                {
                    userPermissions |= rolePermission.Permission.PermissionEnum;
                }
            }

            //Convert combined permissions to integer
            var permissionsValue = (Int64)userPermissions;

            //Add custom claim for generated permission values
            identity.AddClaim(
                new Claim(CustomClaimTypes.Permissions, permissionsValue.ToString()));

            //return the customized claims identity
            return identity;
        }
    }
}
