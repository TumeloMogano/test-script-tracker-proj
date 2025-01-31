using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
//using System.Security.Cryptography.Xml;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.DTO;
using TestScriptTracker.Models.ViewModel;
using TestScriptTracker.Repositories.Interface;
using TestScriptTracker.MailingService;
using TestScriptTracker.Models.DTO.Team;
using TestScriptTracker.Repositories.Implementation;

namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectRepository _projectRepository;
        private readonly IClientRepository _clientRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly ITemplateRepository _templateRepository;


        public ProjectsController(IProjectRepository projectRepository, IClientRepository clientRepository, ITeamRepository teamRepository, ITemplateRepository templateRepository)
        {
            _projectRepository = projectRepository;
            _clientRepository = clientRepository;
            _teamRepository = teamRepository;
            _templateRepository = templateRepository;
        }

        [HttpPost]
        [Route("CreateProject")]
        public async Task<IActionResult> CreateProject(ProjectViewModel model)
        {
            try
            {
                var newProject = new Project
                {
                    ProjectName = model.ProjectName,
                    StartDate = model.StartDate,
                    EndDate = model.EndDate,
                    ProjectDescription = model.ProjectDescription,
                    //IsActive = true,
                    IsActive = false,
                    SignedOff = false,
                    SignedOffDate = null,
                    Signature = null,
                    ClientId = model.ClientId,
                    ResponsibleClientRep = model.ResponsibleClientRep,
                    TeamId = model.TeamId,
                    PhaseId = 1
                };

                await _projectRepository.CreateProject(newProject);

                var existingProject = await _projectRepository.GetProjectByIdAsync(newProject.ProjectId);


                var addedProject = new ProjectDto
                {
                    ProjectId = existingProject.ProjectId,
                    ProjectName = existingProject.ProjectName,
                    StartDate = existingProject.StartDate,
                    EndDate = existingProject.EndDate,
                    ProjectDescription = existingProject.ProjectDescription,
                    IsActive = existingProject.IsActive,
                    SignedOff = existingProject.SignedOff,
                    SignedOffDate = existingProject.SignedOffDate,
                    ResponsibleClientRep = existingProject.ResponsibleClientRep,
                    Signature = existingProject.Signature,
                    ClientId = existingProject.ClientId,
                    TeamId = existingProject.TeamId,
                    PhaseId = existingProject.PhaseId,
                    PhaseName = existingProject.Phase.PhaseName
                };

                return Ok(addedProject);
                //return Ok("Project created successfully");
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpGet]
        [Route("GetProjectById/{projectId}")]
        public async Task<IActionResult> GetProjectById(Guid projectId)
        {
            try
            {
                var existingProject = await _projectRepository.GetProjectByIdAsync(projectId);

                if (existingProject == null)
                { return StatusCode(404, "Not Found"); }

                var returnProject = new ProjectDto
                {
                    ProjectId = existingProject.ProjectId,
                    ProjectName = existingProject.ProjectName,
                    StartDate = existingProject.StartDate,
                    EndDate = existingProject.EndDate,
                    ProjectDescription = existingProject.ProjectDescription,
                    IsActive = existingProject.IsActive,
                    SignedOff = existingProject.SignedOff,
                    SignedOffDate = existingProject.SignedOffDate,
                    Signature = existingProject.Signature,
                    ResponsibleClientRep = existingProject.ResponsibleClientRep,
                    ClientId = existingProject.ClientId,
                    TeamId = existingProject.TeamId,
                    PhaseId = existingProject.PhaseId,
                    PhaseName = existingProject.Phase.PhaseName
                };

                return Ok(returnProject);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");

            }
        }

        [HttpGet]
        [Route("GetAllProjects")]
        public async Task<IActionResult> GetAllProjects()
        {
            try
            {
                //Retrieve list from repository
                var projects = await _projectRepository.GetAllProjectsAsync();

                //Map domain model to dto using list retrieved from the repository
                var response = new List<ProjectDto>();
                foreach (var project in projects)
                {
                    response.Add(new ProjectDto
                    {
                        ProjectId = project.ProjectId,
                        ProjectName = project.ProjectName,
                        StartDate = project.StartDate,
                        EndDate = project.EndDate,
                        ProjectDescription = project.ProjectDescription,
                        IsActive = project.IsActive,
                        SignedOff = project.SignedOff,
                        SignedOffDate = project.SignedOffDate,
                        Signature = project.Signature,
                        ResponsibleClientRep = project.ResponsibleClientRep,
                        ClientId = project.ClientId,
                        TeamId = project.TeamId,
                        PhaseId = project.PhaseId,
                        PhaseName = project.Phase.PhaseName
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
        [Route("GetClientProjects/{clientId}")]
        public async Task<IActionResult> GetClientProjects(Guid clientId)
        {
            try
            {
                //Retrieve list from repository
                var projects = await _projectRepository.GetClientProjects(clientId);

                //Map domain model to dto using list retrieved from the repository
                var response = new List<ProjectDto>();
                foreach (var project in projects)
                {
                    response.Add(new ProjectDto
                    {
                        ProjectId = project.ProjectId,
                        ProjectName = project.ProjectName,
                        StartDate = project.StartDate,
                        EndDate = project.EndDate,
                        ProjectDescription = project.ProjectDescription,
                        IsActive = project.IsActive,
                        SignedOff = project.SignedOff,
                        SignedOffDate = project.SignedOffDate,
                        Signature = project.Signature,
                        ResponsibleClientRep = project.ResponsibleClientRep,
                        ClientId = project.ClientId,
                        TeamId = project.TeamId,
                        PhaseId = project.PhaseId,
                        PhaseName = project.Phase.PhaseName
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
        [Route("GetTeamProjects/{teamId}")]
        public async Task<IActionResult> GetTeamProjects(Guid teamId)
        {
            try
            {
                //Retrieve list from repository
                //var projects = await _projectRepository.GetClientProjects(teamId);
                var projects = await _projectRepository.GetTeamProjects(teamId);

                //Map domain model to dto using list retrieved from the repository
                var response = new List<ProjectDto>();
                foreach (var project in projects)
                {
                    response.Add(new ProjectDto
                    {
                        ProjectId = project.ProjectId,
                        ProjectName = project.ProjectName,
                        StartDate = project.StartDate,
                        EndDate = project.EndDate,
                        ProjectDescription = project.ProjectDescription,
                        IsActive = project.IsActive,
                        SignedOff = project.SignedOff,
                        SignedOffDate = project.SignedOffDate,
                        Signature = project.Signature,
                        ResponsibleClientRep = project.ResponsibleClientRep,
                        ClientId = project.ClientId,
                        TeamId = project.TeamId,
                        PhaseId = project.PhaseId,
                        PhaseName = project.Phase.PhaseName
                    });
                }
                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpPut]
        [Route("UpdateProject/{projectId}")]
        public async Task<ActionResult<ProjectDto>> UpdateProject(Guid projectId, ProjectDto model)
        {
            try
            {
                var result = await _projectRepository.GetProjectByIdAsync(projectId);

                if (result == null)
                    return StatusCode(404, "Not Found, the requested project does not exist");
                else
                {
                    result.ProjectName = model.ProjectName;
                    result.StartDate = model.StartDate;
                    result.EndDate = model.EndDate;
                    result.ProjectDescription = model.ProjectDescription;
                    result.IsActive = result.IsActive;
                    result.SignedOff = result.SignedOff;
                    result.SignedOffDate = result.SignedOffDate;
                    result.Signature = result.Signature;
                    result.ResponsibleClientRep = result.ResponsibleClientRep;
                    result.ClientId = result.ClientId;
                    result.TeamId = result.TeamId;
                    result.PhaseId = result.PhaseId;
                }

                if (await _projectRepository.SaveChangesAsync())
                { return Ok(result); }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return StatusCode(400, "Bad Request, your request is invalid!");
        }

        [HttpDelete]
        [Route("RemoveProject/{projectId}")]
        public async Task<IActionResult> RemoveProject(Guid projectId)
        {
            try
            {
                //###################RESTRICTED DELETE#########################
                if (await _projectRepository.HasDependenciesAsync(projectId))
                {
                    return BadRequest("Cannot delete the project because it has dependent entities.");
                }

                var existingProject = await _projectRepository.DeleteProjectAsync(projectId);
                if (existingProject == null)
                {
                    return NotFound("Project not found.");
                }

                var returnProject = new ProjectDto
                {
                    ProjectId = existingProject.ProjectId,
                    ProjectName = existingProject.ProjectName,
                    StartDate = existingProject.StartDate,
                    EndDate = existingProject.EndDate,
                    ProjectDescription = existingProject.ProjectDescription,
                    IsActive = existingProject.IsActive,
                    SignedOff = existingProject.SignedOff,
                    SignedOffDate = existingProject.SignedOffDate,
                    Signature = existingProject.Signature,
                    ResponsibleClientRep = existingProject.ResponsibleClientRep,
                    ClientId = existingProject.ClientId,
                    TeamId = existingProject.TeamId,
                    PhaseId = existingProject.PhaseId
                    //PhaseName = existingProject.Phase.PhaseName
                };

                return Ok(returnProject);
                //return Ok("Project deleted successfully.");

                //var existingProject = await _projectRepository.GetProjectByIdAsync(projectId);

                //if (existingProject == null)
                //    return StatusCode(404, "Not Found, the requested project does not exist");
                //else
                //{
                //    _projectRepository.DeleteProject(existingProject);

                //}

                //if (await _projectRepository.SaveChangesAsync())
                //{
                //    var returnProject = new ProjectDto
                //    {
                //        ProjectId = existingProject.ProjectId,
                //        ProjectName = existingProject.ProjectName,
                //        StartDate = existingProject.StartDate,
                //        EndDate = existingProject.EndDate,
                //        ProjectDescription = existingProject.ProjectDescription,
                //        IsActive = existingProject.IsActive,
                //        SignedOff = existingProject.SignedOff,
                //        SignedOffDate = existingProject.SignedOffDate,
                //        Signature = existingProject.Signature,
                //        ClientId = existingProject.ClientId,
                //        TeamId = existingProject.TeamId,
                //        PhaseId = existingProject.PhaseId
                //    };

                //    return Ok(returnProject);
                //}
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            //return StatusCode(400, "Bad Request, your request is invalid!");
        }

        [HttpPut]
        [Route("AssignTeam")]
        public async Task<IActionResult> AssignTeamProject([FromBody] AssignTeamProjectDto model)
        {
         
            try
            {
                var project = await _projectRepository.AssignTeamToProject(model.ProjectId, model.TeamId);

                if (project == null)
                    return NotFound("Project not found");

                var returnProject = await _projectRepository.GetProjectByIdAsync(model.ProjectId);
                var response = new ProjectDto
                {
                    ProjectId = returnProject.ProjectId,
                    ProjectName = returnProject.ProjectName,
                    ProjectDescription = returnProject.ProjectDescription,
                    StartDate = returnProject.StartDate,
                    EndDate = returnProject.EndDate,
                    IsActive = returnProject.IsActive,
                    SignedOff = returnProject.SignedOff,
                    SignedOffDate = returnProject.SignedOffDate,
                    Signature = returnProject.Signature,
                    ResponsibleClientRep = returnProject.ResponsibleClientRep,
                    ClientId = returnProject.ClientId,
                    TeamId = returnProject.TeamId,
                    PhaseId = returnProject.PhaseId,
                    PhaseName = returnProject.Phase.PhaseName
                };

                return Ok(response);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }


        [HttpGet("GetProjectsFilteredForUserAccess/{userId}")]
        public async Task<IActionResult> GetProjectsFilteredForUserAccess(Guid userId)
        {
            try
            {
                // Retrieve data from repositories
                var projects = await _projectRepository.GetAllProjectsAsync();
                var teams = await _teamRepository.GetAllTeamsAsync();
                var teamMembers = await _teamRepository.GetAllTeamsMembersAsync();

                // Filter data
                var userTeams = teamMembers.Where(tm => tm.UserId == userId).Select(tm => tm.TeamId).ToList();
                var userProjects = projects.Where(p => userTeams.Contains(p.TeamId ?? Guid.Empty) && !p.IsDeleted).ToList();

                // Map domain model to DTO
                var response = userProjects.Select(project => new ProjectDto
                {
                    ProjectId = project.ProjectId,
                    ProjectName = project.ProjectName,
                    StartDate = project.StartDate,
                    EndDate = project.EndDate,
                    ProjectDescription = project.ProjectDescription,
                    IsActive = project.IsActive,
                    SignedOff = project.SignedOff,
                    SignedOffDate = project.SignedOffDate,
                    Signature = project.Signature,
                    ResponsibleClientRep = project.ResponsibleClientRep,
                    ClientId = project.ClientId,
                    TeamId = project.TeamId,
                    PhaseId = project.PhaseId,
                    PhaseName = project.Phase.PhaseName
                }).ToList();

                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }


        [HttpPut]
        [Route("ActivateProject/{projectId}")]
        public async Task<ActionResult<ProjectDto>> ActivateProject(Guid projectId)
        {
            try
            {
                var result = await _projectRepository.GetProjectByIdAsync(projectId);

                if (result == null)
                    return StatusCode(404, "Not Found, the requested project does not exist");
                else
                {
                    result.ProjectName = result.ProjectName;
                    result.StartDate = result.StartDate;
                    result.EndDate = result.EndDate;
                    result.ProjectDescription = result.ProjectDescription;
                    result.IsActive = true; // set IsActive to TRUE
                    result.SignedOff = result.SignedOff;
                    result.SignedOffDate = result.SignedOffDate;
                    result.Signature = result.Signature;
                    result.ResponsibleClientRep = result.ResponsibleClientRep;
                    result.ClientId = result.ClientId;
                    result.TeamId = result.TeamId;
                    result.PhaseId = result.PhaseId;
                }

                if (await _projectRepository.SaveChangesAsync())
                { return Ok(result); }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return StatusCode(400, "Bad Request, your request is invalid!");
        }


        [HttpPut]
        [Route("DeActivateProject/{projectId}")]
        public async Task<ActionResult<ProjectDto>> DeActivateProject(Guid projectId)
        {
            try
            {
                var result = await _projectRepository.GetProjectByIdAsync(projectId);

                if (result == null)
                    return StatusCode(404, "Not Found, the requested project does not exist");

                if (result.EndDate >= DateTime.Now && result.PhaseId == 3 && result.SignedOff)
                {
                    result.IsActive = false;
                }
                else
                {
                    return StatusCode(400, "Failed to deactivate project. Conditions not met.");
                }

                result.ProjectName = result.ProjectName;
                result.StartDate = result.StartDate;
                result.EndDate = result.EndDate;
                result.ProjectDescription = result.ProjectDescription;
                result.SignedOff = result.SignedOff;
                result.SignedOffDate = result.SignedOffDate;
                result.Signature = result.Signature;
                result.ResponsibleClientRep = result.ResponsibleClientRep;
                result.ClientId = result.ClientId;
                result.TeamId = result.TeamId;
                result.PhaseId = result.PhaseId;

                if (await _projectRepository.SaveChangesAsync())
                {
                    return Ok(result);
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return StatusCode(400, "Bad Request, your request is invalid!");
        }

        [HttpPut]
        [Route("AssignResponsibleClientRep")]
        public async Task<ActionResult<ProjectDto>> AssignResponsibleClientRep([FromBody] AssignClientRepDto model)
        {
            try
            {
                var result = await _projectRepository.GetProjectByIdAsync(model.ProjectId);

                if (result == null)
                    return StatusCode(404, "Not Found, the requested project does not exist");
                else
                {
                    result.ProjectName = result.ProjectName;
                    result.StartDate = result.StartDate;
                    result.EndDate = result.EndDate;
                    result.ProjectDescription = result.ProjectDescription;
                    result.IsActive = result.IsActive;
                    result.SignedOff = result.SignedOff;
                    result.SignedOffDate = result.SignedOffDate;
                    result.Signature = result.Signature;
                    result.ResponsibleClientRep = model.ClientRepEmail;
                    result.ClientId = result.ClientId;
                    result.TeamId = result.TeamId;
                    result.PhaseId = result.PhaseId;
                }

                if (await _projectRepository.SaveChangesAsync())
                {
                    return Ok(result);
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }

            return StatusCode(400, "Bad Request, your request is invalid!");
        }


        [HttpGet]
        [Route("GetProjectsByClientRep")]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjectsByClientRep([FromQuery] string clientRepEmail)
        {
            try
            {
                var projects = await _projectRepository.GetProjectsByClientRepEmailAsync(clientRepEmail);

                if (!projects.Any())
                {
                    return NotFound("No projects found for the given client representative.");
                }

                var projectDtos = projects.Select(p => new ProjectDto
                {
                    ProjectId = p.ProjectId,
                    ProjectName = p.ProjectName,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    ProjectDescription = p.ProjectDescription,
                    IsActive = p.IsActive,
                    SignedOff = p.SignedOff,
                    ResponsibleClientRep = p.ResponsibleClientRep,
                    ClientId = p.ClientId,
                    TeamId = p.TeamId,
                    PhaseId = p.PhaseId,
                    PhaseName = p.Phase.PhaseName
                }).ToList();

                return Ok(projectDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }



        [HttpGet]
        [Route("GetProjectActiveStatus/{projectId}")]
        public async Task<IActionResult> GetProjectActiveStatus(Guid projectId)
        {
            try
            {
                var existingProject = await _projectRepository.GetProjectByIdAsync(projectId);

                if (existingProject == null)
                { return StatusCode(404, "Not Found"); }

                var returnProject = new ProjectAStatusDto
                {
                    ProjectId = existingProject.ProjectId,
                    IsActive = existingProject.IsActive,
                };

                return Ok(returnProject);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");

            }
        }


        [HttpGet]
        [Route("GetAllPhases")]
        public async Task<IActionResult> GetAllPhases()
        {
            try
            {
                var phases = await _templateRepository.GetAllPhasesAsync();

                var response = new List<ProjectPhaseDto>();
                foreach (var phase in phases)
                {
                    response.Add(new ProjectPhaseDto
                    {
                        PhaseId = phase.PhaseId,
                        PhaseName = phase.PhaseName
                    });
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support. " + ex.Message);
            }
        }


    }
}
