using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.DTO.Roles;
using TestScriptTracker.Models.ViewModel;
using TestScriptTracker.Repositories.Interface;

namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RolesController : ControllerBase
    {
        private readonly IRoleRepository roleRepository;

        public RolesController(IRoleRepository roleRepository) 
        {
            this.roleRepository = roleRepository;
        }

        // POST: https://localhost:XXXX/api/Roles/CreateRole
        [HttpPost]
        [Route("CreateRole")]
        //[DynamicAuthorize(Permissions.ManageRoles)]
        public async Task<IActionResult> CreateRole(RoleViewModel model)
        {
            try
            {
                //map viewmodel to domain model
                var newRole = new Role
                {
                    Name = model.Name,
                    NormalizedName = model.Name.ToUpper(),
                    RoleDescription = model.RoleDescription,
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                };

                //call createRole method from the repository
                await roleRepository.CreateRoleAsync(newRole);

                //map response to dto
                var response = new RoleDto
                {
                    RoleId = newRole.Id,
                    Name = newRole.Name,
                    NormalizedName = newRole.NormalizedName,
                    RoleDescription = newRole.RoleDescription
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support. " + ex.Message );
            }
        }

        [HttpGet]
        [Route("GetAllRoles")]
        //[DynamicAuthorize(Permissions.ViewRoles)]
        public async Task<IActionResult> GetAllRoles()
        {
            try
            {
                var roles = await roleRepository.GetAllRolesAsync();

                var response = new List<RoleDto>();
                foreach (var role in roles)
                {
                    response.Add(new RoleDto
                    {
                        RoleId = role.Id,
                        Name = role.Name,
                        NormalizedName = role.NormalizedName,
                        RoleDescription = role.RoleDescription
                    });
                }

                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        // GET: https://localhost:XXXX/api/Roles/GetRoleById/{roleid}
        [HttpGet]
        [Route("GetRoleById/{roleid:Guid}")]
        public async Task<IActionResult> GetRoleById([FromRoute] Guid roleid)
        {
            try
            {
                var existingRole = await roleRepository.GetRoleByIdAsync(roleid);

                if (existingRole == null)
                {
                    return NotFound();
                }


                var response = new RoleDto
                {
                    RoleId = existingRole.Id,
                    Name = existingRole.Name,
                    NormalizedName = existingRole.NormalizedName,
                    RoleDescription = existingRole.RoleDescription
                };

                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        // PUT: https://localhost:XXXX/api/Roles/UpdateRole/{roleid}
        [HttpPut]
        [Route("UpdateRole/{roleid:Guid}")]
        public async Task<IActionResult> UpdateRole([FromRoute] Guid roleid, RoleViewModel model)
        {
            try
            {
                var role = new Role
                {
                    Id = roleid,
                    Name = model.Name,
                    NormalizedName = model.Name.ToUpper(),
                    RoleDescription = model.RoleDescription
                };

                role = await roleRepository.UpdateRoleAsync(role);

                if (role == null)
                {
                    return NotFound();
                }

                var response = new RoleDto
                {
                    RoleId = role.Id,
                    Name = role.Name,
                    NormalizedName = role.NormalizedName,
                    RoleDescription = role.RoleDescription
                };

                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        // DELETE: https://localhost:XXXX/api/Roles/RemoveRole/{roleid}
        [HttpDelete]
        [Route("RemoveRole/{roleid:Guid}")]
        public async Task<IActionResult> RemoveRole([FromRoute] Guid roleid)
        {
            try
            {

                if (await roleRepository.HasDependenciesAsync(roleid))
                {
                    return BadRequest("Cannot delete the role because it has dependent entities.");
                }

                var result = await roleRepository.DeleteRolesAsync(roleid);

                if (!result)
                    return NotFound("Role not found");

                return Ok("Role deleted successfully.");

                //var existingRole = await roleRepository.DeleteRoleAsync(roleid);

                //if (existingRole == null)
                //{
                //    return NotFound();
                //}

                //var response = new RoleDto
                //{
                //    RoleId = roleid,
                //    Name = existingRole.Name,
                //    NormalizedName = existingRole.NormalizedName,
                //    RoleDescription = existingRole.RoleDescription
                //};

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

            [HttpGet]
            [Route("GetUserRoles/{email}")]
            public async Task<IActionResult> GetUserRoles([FromRoute] string email)
            {
                try
                {
                    var roles = await roleRepository.GetUserRolesByEmailAsync(email);

                    if (!roles.Any())
                    {
                        return NotFound();
                    }

                    var response = roles.Select(role => new RoleDto
                    {
                        RoleId = role.Id,
                        Name = role.Name,
                        NormalizedName = role.NormalizedName,
                        RoleDescription = role.RoleDescription
                    }).ToList();

                    return Ok(response);

                }
                catch (Exception)
                {
                    return StatusCode(500, "Internal Server Error. Please Contact Support");
                }
            }

            [HttpPost]
            [Route("AddUserToRole")]
            public async Task<IActionResult> AddUserToRole([FromBody] AssingUserRoleVM model)
            {
                try
                {
                    await roleRepository.AssignUserToRoleAsync(model.UserId, model.RoleName);
                    return Ok("User assigned to role successfully");
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error. Please Contact Support. Error: {ex.Message}");
                }
            }

            [HttpPost]
            [Route("RemoveUserFromRole")]
            public async Task <IActionResult> RemoveUserFromRole([FromBody] AssingUserRoleVM model)
            {
                try
                {
                    await roleRepository.UnassignUserFromRoleAsync(model.UserId, model.RoleName);
                    return Ok("Successfully removed");
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error. Please Contact Support. Error: {ex.Message}");
                }
            }
    }
}
