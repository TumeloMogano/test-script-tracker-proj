using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.DTO;
using TestScriptTracker.Models.DTO.Team;
using TestScriptTracker.Models.ViewModel;
using TestScriptTracker.Repositories.Implementation;
using TestScriptTracker.Repositories.Interface;

namespace TestScriptTracker.Controllers
{
    //https://localhost:xxxx/api/teams
    [Route("api/[controller]")]
    [ApiController]
    public class TeamsController : ControllerBase
    {
        private readonly ITeamRepository teamRepository;
        private readonly IClientRepository _clientRepository;


        public TeamsController(ITeamRepository teamRepository, IClientRepository clientRepository)
        {
            this.teamRepository = teamRepository;
            _clientRepository = clientRepository;

        }

        // GET: https://localhost:XXXX/api/Teams/CreateTeam
        [HttpPost]
        [Route("CreateTeam")]
        public async Task<IActionResult> CreateTeam(TeamViewModel model)
        {
            try
            {
                //map vm to domain model
                var team = new Team
                {
                    TeamName = model.TeamName,
                    TeamDescription = model.TeamDescription,
                    CreationDate = DateTime.Now,
                };

                //Call CreateTeamAsync method from the repository to create a new instance (team)
                await teamRepository.CreateTeamAsync(team);

                //Domain to dto
                //the domain model is mapped to the dto, because the data layer must not be exposed by using the actual entity properties
                var response = new TeamDto
                {
                    TeamId = team.TeamId,
                    TeamName = team.TeamName,
                    TeamDescription = team.TeamDescription,
                    CreationDate = team.CreationDate
                };

                return Ok(response);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");

            }

        }

        // GET: https://localhost:XXXX/api/Teams/GetTeams
        [HttpGet]
        [Route("GetTeams")]
        public async Task<IActionResult> GetAllTeams()
        {
            try
            {
                //Retrieve list of teams from repository
                var teams = await teamRepository.GetAllTeamsAsync();


                //Map each team into the Team Dto
                var response = new List<TeamDto>(); //teams will be returned as list of objects
                foreach (var team in teams)
                {
                    response.Add(new TeamDto
                    {
                        TeamId = team.TeamId,
                        TeamName = team.TeamName,
                        TeamDescription = team.TeamDescription,
                        CreationDate = team.CreationDate

                    });
                }

                return Ok(response);

            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpGet]
        [Route("GetFilteredTeamsForUser/{userid:Guid}")]
        public async Task<IActionResult> GetFilteredTeamsForUser(Guid userid)
        {
            try
            {
                var teams = await teamRepository.GetFilteredTeamsForUserAsync(userid);

                var response = new List<TeamDto>();
                foreach (var team in teams)
                {
                    response.Add(new TeamDto
                    {
                        TeamId = team.TeamId,
                        TeamName = team.TeamName,
                        TeamDescription = team.TeamDescription,
                        CreationDate = team.CreationDate
                    });
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }


        // GET: https://localhost:XXXX/api/Teams/GetTeamById/{teamid}
        [HttpGet]
        [Route("GetTeamById/{teamid:Guid}")]
        public async Task<IActionResult> GetTeamById([FromRoute] Guid teamid)
        {
            try
            {
                //get existingteam using id, from the implementation layer (Repository)
                var existingTeam = await teamRepository.GetTeamByIdAsync(teamid);

                if (existingTeam == null)
                {
                    return NotFound();
                }

                //Map response using TeamDto as new object
                var response = new TeamDto
                {
                    TeamId = existingTeam.TeamId,
                    TeamName = existingTeam.TeamName,
                    TeamDescription = existingTeam.TeamDescription,
                    CreationDate = existingTeam.CreationDate

                };

                return Ok(response);

            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        // PUT: https://localhost:XXXX/api/Teams/UpdateTeam/{teamid}
        [HttpPut]
        [Route("UpdateTeam/{teamid:Guid}")]
        public async Task<IActionResult> UpdateTeam([FromRoute] Guid teamid, TeamViewModel model)
        {
            try
            {
                var team = new Team
                {
                    TeamId = teamid,
                    TeamName = model.TeamName,
                    TeamDescription = model.TeamDescription,
                    CreationDate = model.CreationDate
                };

                team = await teamRepository.UpdateTeamAsync(team);

                if (team == null)
                {
                    return NotFound();
                }

                var response = new TeamDto
                {
                    TeamId = team.TeamId,
                    TeamName = model.TeamName,
                    TeamDescription = model.TeamDescription,
                    CreationDate = model.CreationDate
                };

                return Ok(response);

            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        // DELETE: https://localhost:XXXX/api/Teams/RemoveTeam/{teamid}
        [HttpDelete]
        [Route("RemoveTeam/{teamid:Guid}")]
        public async Task<IActionResult> DeleteTeam([FromRoute] Guid teamid)
        {
            try
            {
                if (await teamRepository.HasDependenciesAsync(teamid))
                {
                    return BadRequest(new { message = "Cannot delete the team because it has dependent entities." });
                }

                var result = await teamRepository.DeleteTeamsAsync(teamid);

                if (!result)
                {
                    return NotFound(new { message = "Team not found." });
                }

                return Ok(new { message = "Team deleted successfully." });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }


        }

        [HttpGet]
        [Route("GetTeamMembers/{teamid:Guid}")]
        public async Task<IActionResult> GetTeamMembersByTeamId([FromRoute] Guid teamid)
        {
            try
            {
                //Retrieve list of teams from repository
                var teamMembers = await teamRepository.GetTeamMembersAsync(teamid);


                //Map each team into the Team Dto
                var response = new List<GetTeamMembersDto>(); //teams will be returned as list of objects
                foreach (var teamMember in teamMembers)
                {
                    response.Add(new GetTeamMembersDto
                    {
                        TeamId = teamMember.TeamId,
                        UserId = teamMember.UserId,
                        UserFirstName = teamMember.User.UserFirstName,
                        UserSurname = teamMember.User.UserSurname,
                        UserEmailAddress = teamMember.User.UserEmailAddress,
                        UserContactNumber = teamMember.User.UserContactNumber,
                        IsTeamLead = teamMember.IsTeamLead
                    });
                }

                return Ok(response);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpPost]
        [Route("AddTeamMember/{teamid:Guid}")]
        public async Task<IActionResult> AddTeamMembers([FromRoute] Guid teamid, [FromBody] AddTeamMembersDto model)
        {
            if (teamid != model.TeamId)
            {
                BadRequest("Team ID in the URL does not match Team ID in the body.");
            }

            try
            {

                var members = await teamRepository.AddTeamMembers(model.TeamId, model.TeamMembers);

                var response = members.Select(x => new TeamMemberViewModel
                {
                    TeamId = x.TeamId,
                    UserId = x.UserId,
                    IsTeamLead = x.IsTeamLead
                }).ToList();

                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        //Update isTeamLead using patch
        [HttpPatch]
        [Route("{teamid:Guid}/member/{userid:Guid}/isTeamLead")]
        public async Task<IActionResult> UpdateTeamLead(Guid teamid, Guid userid, [FromBody] bool isTeamLead)
        {
            try
            {
                var teamMember = await teamRepository.UpdateMemberLeadership(teamid, userid, isTeamLead);

                if (teamMember == null)
                {
                    return NotFound("Team member not found");
                }

                var response = new TeamMemberDto
                {
                    TeamId = teamMember.TeamId,
                    UserId = teamMember.UserId,
                    IsTeamLead = teamMember.IsTeamLead
                };

                return Ok(response);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpDelete]
        [Route("{teamid:Guid}/member/{userid:Guid}")]
        public async Task<IActionResult> RemoveTeamMember(Guid teamid, Guid userid)
        {
            try
            {
                var teamMember = await teamRepository.RemoveTeamMember(teamid, userid);

                if (teamMember == null)
                {
                    return NotFound("Team Member not found.");
                }

                var response = new TeamMemberDto
                {
                    TeamId = teamMember.TeamId,
                    UserId = teamMember.UserId,
                    IsTeamLead = teamMember.IsTeamLead
                };

                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpGet]
        [Route("GetAvailableUsers/{teamid:Guid}")]
        public async Task<IActionResult> GetAvailableUsers(Guid teamid)
        {
            try
            {
                var users = await teamRepository.GetAvailableUsersForTeamAsync(teamid);

                var response = new List<GetTeamUsersDto>(); //teams will be returned as list of objects
                foreach (var user in users)
                {
                    response.Add(new GetTeamUsersDto
                    {
                        UserId = user.Id,
                        UserFirstName = user.UserFirstName,
                        UserSurname = user.UserSurname,
                        UserContactNumber = user.UserContactNumber,
                        UserEmailAddress = user.UserEmailAddress
                    });
                }

                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }


        // GET: https://localhost:XXXX/api/Teams/GetFullTeams
        [HttpGet]
        [Route("GetFullTeams")]
        public async Task<IActionResult> GetFullTeams()
        {
            try
            {
                // Retrieve list of teams from the repository
                var teams = await teamRepository.GetAllTeamsAsync();

                // Initialize response list
                var response = new List<TeamDto>();

                foreach (var team in teams)
                {
                    // Retrieve team members for the current team
                    var teamMembers = await teamRepository.GetTeamMembersAsync(team.TeamId);

                    // Skip teams that have no members
                    if (teamMembers == null || !teamMembers.Any())
                    {
                        continue; // Skip this team and move to the next one
                    }

                    // Identify the team lead (assuming team lead is determined by a property like IsTeamLead)
                    var teamLead = teamMembers.FirstOrDefault(member => member.IsTeamLead);

                    // Skip teams that do not have a team lead
                    if (teamLead == null)
                    {
                        continue; // Skip this team and move to the next one
                    }

                    // Only add the team to the response if there are members and a team lead
                    response.Add(new TeamDto
                    {
                        TeamId = team.TeamId,
                        TeamName = team.TeamName,
                        TeamDescription = team.TeamDescription,
                        CreationDate = team.CreationDate
                    });
                }

                // Return the list of valid teams
                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpGet]
        [Route("IsUserTeamLead/{userId:Guid}/{projectId:Guid}")]
        public async Task<IActionResult> IsUserTeamLead(Guid userId, Guid projectId)
        {
            try
            {
                bool isTeamLead = await teamRepository.CheckIsTeamLeadAsync(userId, projectId);
                return Ok(isTeamLead);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet]
        [Route("CanAddTeamLead/{teamId:Guid}")]
        public async Task<IActionResult> CanAddTeamLead(Guid teamId)
        {
            try
            {
                bool canAddTeamLead = await teamRepository.CanAddTeamLeadAsync(teamId);
                return Ok(canAddTeamLead); //If true, you can add a team lead, else you cannot
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet]
        [Route("CanAddMemberToTeam/{teamId:Guid}")]
        public async Task<IActionResult> CanAddMemberToTeam(Guid teamId)
        {
            try
            {
                bool canAddMember = await teamRepository.CanAddMemberToTeamAsync(teamId);
                return Ok(canAddMember); //If true, you can add a team member, else you cannot
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

    }
}