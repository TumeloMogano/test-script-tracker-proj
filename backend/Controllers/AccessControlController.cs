using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.DTO.Roles;
using TestScriptTracker.Models.ViewModel;
using TestScriptTracker.Repositories.Interface;
using TestScriptTracker.Shared.Authorization;

namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccessControlController(IPermissionRepository permissionRepository, IRoleRepository roleRepository)
        : ControllerBase
    {
        [HttpGet]
        [Route("GetConfiguration/{roleid:guid}")]
        //[DynamicAuthorize(Permissions.ConfigureAccessControl)]
        public async Task<ActionResult<AccessControlViewModel>> GetConfiguration(Guid roleid)
        {
            var role = await roleRepository.GetRoleWithPermissionAsync(roleid);

            if (role == null)
            {
                return NotFound(new { message = "Role not found!" });
            }

            var allPermissions = await permissionRepository.GetAllPermissionsAsync();

            var permissionDescriptions = allPermissions.ToDictionary(
                p => (long)p.PermissionEnum,
                p => p.PermissionDescription);

            var roleDto = new AuthRoleDto(
                role.Id,
                role.Name ?? string.Empty,
                role.RoleDescription ?? string.Empty,
                role.Permissions,
                permissionDescriptions);

            return new AccessControlViewModel(new List<AuthRoleDto> { roleDto });
        }

        [HttpPut]
        [Route("UpdateConfiguration")]
        //[DynamicAuthorize(Permissions.ConfigureAccessControl)]
        public async Task<IActionResult> UpdateConfiguration(AuthRoleDto updatedRole)
        {

            //Fetch role with its permissions usign the roleid
            var role = await roleRepository.GetRoleWithPermissionAsync(updatedRole.RoleId);

            if (role != null)
            {
                // Remove existing permissions
                role.RolePermissions.Clear();

                //Fetch all permissions
                var allPermissions = await permissionRepository.GetAllPermissionsAsync();

                //Check if any permissions other than None are being added
                bool addingOtherPermissions = updatedRole.Permissions != Permissions.None;


                // Add new permissions                 
                foreach (var permission in PermissionsProvider.GetAll())
                {
                    // Add logging to check the permissions being processed
                    Console.WriteLine($"Processing permission: {permission}");

                    if (addingOtherPermissions && permission == Permissions.None) continue;

                    if (updatedRole.Has(permission))
                    {
                        var permissionEntity = allPermissions
                            .FirstOrDefault(p => p.PermissionEnum == permission);
                        if (permissionEntity != null)
                        {
                            var existingRolePermission = role.RolePermissions
                                .FirstOrDefault(rp => rp.PermissionId == permissionEntity.PermissionId);

                            if (existingRolePermission == null)
                            {
                                Console.WriteLine($"Adding permission: {permission}");
                                role.RolePermissions.Add(new RolePermission
                                {
                                    RoleId = role.Id,
                                    PermissionId = permissionEntity.PermissionId
                                });
                            }

                        }
                    }
                }

                //if only None is being added, handle it explicitly
                if (!addingOtherPermissions)
                {
                    var nonePermission = allPermissions
                        .FirstOrDefault(p => p.PermissionEnum == Permissions.None);

                    if (nonePermission != null)
                    {
                        var existingNonePermission = role.RolePermissions
                            .FirstOrDefault(rp => rp.PermissionId == nonePermission.PermissionId);

                        if (existingNonePermission == null)
                        {
                            role.RolePermissions.Add(new RolePermission
                            {
                                RoleId = role.Id,
                                PermissionId = nonePermission.PermissionId
                            });
                        }
                    }
                }

                await roleRepository.UpdateRolePermissionsAsync(role);

                return Ok(new { message = "Role permissions updated successfully." });
            }

            return NotFound(new { message = "Role not found." });
        }
    }
}
