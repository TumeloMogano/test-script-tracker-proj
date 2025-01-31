using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.DTO;
using TestScriptTracker.Models.ViewModel;
using TestScriptTracker.Repositories.Implementation;
using TestScriptTracker.Repositories.Interface;
using TestScriptTracker.Models.CombinedModels;
using TestScriptTracker.Models;

namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportingController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IClientRepository _clientRepository;
        private readonly ITemplateRepository _templateRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly IReportingRepository _reportingRepository;

        public ReportingController(IUserRepository userRepository, IClientRepository clientRepository, ITemplateRepository templateRepository, IProjectRepository projectRepository, ITeamRepository teamRepository, IReportingRepository reportingRepository)
        {
            _userRepository = userRepository;
            _clientRepository = clientRepository;
            _templateRepository = templateRepository;
            _projectRepository = projectRepository;
            _teamRepository = teamRepository;
            _reportingRepository = reportingRepository;
        }

        [HttpGet]
        [Route("GenerateRegisteredUsersReport")]
        public async Task<IActionResult> GenerateRegisteredUserReport()
        {
            try
            {
                var users = await _userRepository.GetsAllUsersAsync();

                var registeredUsersReport = users
                    .Where(u => u.RegStatusId == 4)
                    .Select(u => new 
                    { 
                        FirstName = u.UserFirstName, 
                        LastName = u.UserSurname, 
                        Email = u.UserEmailAddress,
                        RegisteredDate = u.RegistrationDate,
                    })
                    .ToList();

                return Ok(registeredUsersReport);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error, please contact support");
            }
        }


        [HttpGet]
        [Route("GenerateActiveProjectsReport")]
        public async Task<IActionResult> GenerateActiveProjectsReport()
        {
            try
            {
                var projects = await _projectRepository.GetAllProjectswithClientAsync();

                var activeProjectsReport = projects
                    .Where(p => p.IsActive == true)
                    .Select(p => new 
                    { projectName = p.ProjectName, 
                        startDate = p.StartDate, 
                        endDate = p.EndDate, 
                        clientName = p.Client.ClientName 
                    })
                    .ToList();

                return Ok(activeProjectsReport);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error, please contact support");
            }
        }


        [HttpGet]
        [Route("GenerateTemplatesReport")]
        public async Task<IActionResult> GenerateTemplatesReport()
        {
            try
            {
                var templates = await _templateRepository.GetAllTemplatesAsync();

                var templatesReport = templates
                    .Select(t => new 
                    { 
                        templateName = t.TemplateName, 
                        templateTest = t.TemplateTest, 
                        createdDate = t.TempCreateDate
                    })
                    .ToList();

                return Ok(templatesReport);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error, please contact support");
            }
        }

        [HttpGet]
        [Route("GenerateClientsReport")]
        public async Task<IActionResult> GenerateClientsReport()
        {
            try
            {
                var clients = await _clientRepository.GetAllClientsAsync();

                var clientsReport = clients
                    .Select(c => new 
                    { 
                        clientName = c.ClientName, 
                        clientEmail = c.ClientEmail, 
                        clientRegNr = c.ClientRegistrationNr, 
                        clientNr = c.ClientNumber,
                        createdDate = c.CreationDate
                    })
                    .ToList();

                return Ok(clientsReport);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error, please contact support");
            }
        }




        [HttpGet]
        [Route("GenerateDefectsReport")]
        public async Task<IActionResult> GenerateDefectsReport([FromQuery] Guid? projectId = null)
        {
            try
            {
                var defects = await _templateRepository.GetAllDefectsAsync();
                var projects = await _projectRepository.GetAllProjectsAsync();
                var testscripts = await _templateRepository.GetAllTestScriptsAsync();
                var defectsStatus = await _templateRepository.GetAllDefectStatusesAsync();

                // Exclude defects with DefectStatusId of 3
                var Validdefects = defects.Where(d => d.DefectStatusId != 3).ToList();

                var defectsArray = Validdefects.ToArray();

                var defectsReport = projects
                    .Join(testscripts, p => p.ProjectId, ts => ts.ProjectId, (p, ts) => new { p, ts })
                    .Join(defectsArray, dts => dts.ts.TestScriptId, d => d.TestScriptId, (dts, d) => new { dts.ts, dts.p, d })
                    .Join(defectsStatus, dtsd => dtsd.d.DefectStatusId, ds => ds.DefectStatusId, (dtsd, ds) => new
                    {
                        projectName = dtsd.p.ProjectName,
                        projectId = dtsd.p.ProjectId,
                        defectDescription = dtsd.d.DefectDescription,
                        defectStatusName = ds.DefectStatusName
                    });

                if (projectId.HasValue)
                {
                    defectsReport = defectsReport.Where(x => x.projectId == projectId.Value);
                }

                var groupedReport = defectsReport
                    .GroupBy(ds => ds.projectName)
                    .Select(g => new
                    {
                        ProjectName = g.Key,
                        DefectStatuses = g
                            .GroupBy(x => x.defectStatusName)
                            .Select(dsg => new
                            {
                                DefectStatusName = dsg.Key,
                                DefectCount = dsg.Count(),
                                Defects = dsg.Select(x => new
                                {
                                    x.defectDescription
                                }).ToList()
                            }).ToList()
                    })
                    .ToList();

                return Ok(groupedReport);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error, please contact support");
            }
        }


        [HttpGet]
        [Route("GenerateProjectPhaseReport")]
        public async Task<IActionResult> GenerateProjectPhaseReport()
        {
            try
            {
                var projects = await _projectRepository.GetAllProjectswithPhasesAsync();
                var phases = await _templateRepository.GetAllPhasesAsync();


                var projectPhaseReport = projects.Where(p => p.IsActive == true)
                    .GroupBy(p => new { Phase = p.Phase.PhaseName})
                    .Select(g => new
                    {
                        ProjectPhase = g.Key.Phase,
                        Count = g.Count(),
                        Projects = g.Select(p => p.ProjectName).ToList()
                    })
                    .ToList();

                return Ok(projectPhaseReport);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error, please contact support");
            }
        }


        [HttpGet]
        [Route("GetAllActiveProjects")]
        public async Task<IActionResult> GetAllActiveProjects()
        {
            try
            {
                var projects = await _reportingRepository.GetAllActiveProjectsAsync();

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
                        ClientId = project.ClientId,
                        TeamId = project.TeamId,
                        PhaseId = project.PhaseId
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
        [Route("GetAllTeams")]
        public async Task<IActionResult> GetAllTeams()
        {
            try
            {
                var teams = await _reportingRepository.GetAllTeamsAsync();

                return Ok(teams);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }


        [HttpGet]
        [Route("GetPhases")]
        public async Task<IActionResult> GetPhases()
        {
            try
            {
                var phases = await _reportingRepository.GetAllPhasesAsync();

                return Ok(phases);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }


        [HttpGet]
        [Route("GenerateTestScriptStatusReport")]
        public async Task<IActionResult> GenerateTestScriptStatusReport([FromQuery] Guid? projectId)
        {
            try
            {
                var projects = await _projectRepository.GetAllProjectswithPhasesAsync();
                var testscripts = await _templateRepository.GetAllTestScriptsAsync();

                var activeProjects = projects.Where(p => p.IsActive).ToList();

                //Filter by projectId if provided
                if (projectId.HasValue)
                {
                    activeProjects = activeProjects.Where(p => p.ProjectId == projectId.Value).ToList();
                }

                var filteredTestScripts = testscripts.Where(ts => activeProjects.Any(p => p.ProjectId == ts.ProjectId)).ToList();

                var TestScriptStatusReport = filteredTestScripts
                    .GroupBy(ts => new { Status = ts.StatusType.StatusTypeName })
                    .Select(g => new
                    {
                        TestScriptStatus = g.Key.Status,
                        Count = g.Count(),
                    })
                    .ToList();

                var result = new
                {
                    ProjectNames = activeProjects.Select(p => p.ProjectName).ToList(),
                    TestScriptStatusReport
                };

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error, please contact support");
            }
        }



        [HttpGet]
        [Route("GenerateTestScriptStatusPhasesReport")]
        public async Task<IActionResult> GenerateTestScriptStatusPhasesReport([FromQuery] int? phaseId)
        {
            try
            {
                var projects = await _projectRepository.GetAllProjectswithPhasesAsync();
                var phases = await _templateRepository.GetAllPhasesAsync();
                var testscripts = await _templateRepository.GetAllTestScriptsAsync();
                var statuses = await _templateRepository.GetAllStatusesAsync();

                var activeProjects = projects.Where(p => p.IsActive).ToList();

                //Filter by phaseId if provided
                if (phaseId.HasValue)
                {
                    activeProjects = activeProjects.Where(p => p.PhaseId == phaseId.Value).ToList();
                }

                var TSStatusPhaseReport = activeProjects
                    .Join(testscripts, p => p.ProjectId, ts => ts.ProjectId, (p, ts) => new { p, ts })
                    .Join(statuses, pts => pts.ts.StatusTypeId, s => s.StatusTypeId, (pts, s) => new { pts.ts, pts.p, s })
                    .Join(phases, ptsd => ptsd.p.PhaseId, ps => ps.PhaseId, (ptsd, ps) => new
                    {
                        statusName = ptsd.s.StatusTypeName,
                        phaseName = ps.PhaseName
                    })
                    .GroupBy(ptsd => new { ptsd.statusName, ptsd.phaseName })
                    .Select(group => new
                    {
                        Status = group.Key.statusName,
                        Phase = group.Key.phaseName,
                        Count = group.Count()
                    })
                    .ToList();

                var result = new
                {
                    PhaseNames = activeProjects.Select(p => p.Phase.PhaseName).Distinct().ToList(),
                    TSStatusPhaseReport
                };

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error, please contact support");
            }
        }


        [HttpGet("GenerateAssignedScriptsReport")]
        public async Task<IActionResult> GenerateAssignedScriptsReport([FromQuery] Guid? projectId, [FromQuery] Guid? teamId)
        {
            try
            {
                var projects = await _projectRepository.GetAllProjectswithPhasesAsync();
                var teams = await _teamRepository.GetAllTeamsAsync();
                var users = await _userRepository.GetsAllUsersAsync();
                var testscripts = await _templateRepository.GetAllTestScriptsAsync();
                var teamMembers = await _templateRepository.GetAllTeamMembersAsync();
                var TSAssignment = await _templateRepository.GetAllTSAssignmentsAsync();

                var query = from project in projects
                            join team in teams on project.TeamId equals team.TeamId
                            join teamMember in teamMembers on team.TeamId equals teamMember.TeamId
                            join user in users on teamMember.UserId equals user.Id
                            join testScript in testscripts on project.ProjectId equals testScript.ProjectId
                            join tsAssignment in TSAssignment on new { TestScriptId = testScript.TestScriptId, UserId = user.Id } equals new { TestScriptId = tsAssignment.TestScriptId, UserId = tsAssignment.UserId }
                            select new
                            {
                                ProjectID = project.ProjectId,
                                ProjectName = project.ProjectName,
                                TeamID = team.TeamId,
                                TeamName = team.TeamName,
                                UserID = user.Id,
                                UserName = $"{user.UserFirstName} {user.UserSurname}",
                                TestScriptID = testScript.TestScriptId,
                                TestScriptTest = testScript.Test,
                                //AssignmentDetails = tsAssignment.AssignmentDetails
                            };

                // Filter by ProjectID if provided
                if (projectId.HasValue)
                {
                    query = query.Where(x => x.ProjectID == projectId.Value);
                }

                // Filter by TeamID if provided
                if (teamId.HasValue)
                {
                    query = query.Where(x => x.TeamID == teamId.Value);
                }

                List<TestScriptReport> result;
                if (projectId.HasValue)
                {
                    result = query.GroupBy(x => new { x.UserID, x.UserName })
                                  .Select(g => new TestScriptReport
                                  {
                                      ProjectID = g.First().ProjectID, 
                                      ProjectName = g.First().ProjectName, 
                                      TeamName = g.First().TeamName, 
                                      UserID = g.Key.UserID,
                                      UserName = g.Key.UserName,
                                      TestScripts = g.Select(x => new TestScriptDetails { TestScriptID = x.TestScriptID, TestScriptTest = x.TestScriptTest }).ToList()
                                  })
                                  .ToList();
                }
                else if (teamId.HasValue)
                {
                    result = query.GroupBy(x => new { x.ProjectID, x.ProjectName, x.UserID, x.UserName, x.TeamName })
                                  .Select(g => new TestScriptReport
                                  {
                                      ProjectID = g.Key.ProjectID,
                                      ProjectName = g.Key.ProjectName,
                                      TeamName = g.Key.TeamName,
                                      UserID = g.Key.UserID,
                                      UserName = g.Key.UserName,
                                      TestScripts = g.Select(x => new TestScriptDetails { TestScriptID = x.TestScriptID, TestScriptTest = x.TestScriptTest }).ToList()
                                  })
                                  .ToList();
                }
                else
                {
                    // Handle case where neither projectId nor teamId is provided
                    result = query.GroupBy(x => new { x.TeamID, x.TeamName, x.ProjectID, x.ProjectName, x.UserID, x.UserName })
                                  .Select(g => new TestScriptReport
                                  {
                                      ProjectID = g.Key.ProjectID,
                                      ProjectName = g.Key.ProjectName,
                                      TeamID = g.Key.TeamID,
                                      TeamName = g.Key.TeamName,
                                      UserID = g.Key.UserID,
                                      UserName = g.Key.UserName,
                                      TestScripts = g.Select(x => new TestScriptDetails { TestScriptID = x.TestScriptID, TestScriptTest = x.TestScriptTest }).ToList()
                                  })
                                  .ToList();
                }

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }


        [HttpGet("GenerateUserLoadReport")]
        public async Task<IActionResult> GenerateUserLoadReport()
        {
            try
            {
                var projects = await _projectRepository.GetAllProjectswithPhasesAsync();
                var teams = await _teamRepository.GetAllTeamsAsync();
                var users = await _userRepository.GetsAllUsersAsync();
                var testscripts = await _templateRepository.GetAllTestScriptsAsync();
                var teamMembers = await _templateRepository.GetAllTeamMembersAsync();
                var TSAssignments = await _templateRepository.GetAllTSAssignmentsAsync();

                //Dictionary to store the number of test scripts assigned to each user
                var userTestScriptCounts = new Dictionary<Guid, int>();

                // Count the number of test scripts assigned to each user
                foreach (var user in users)
                {
                    var assignedTestScriptsCount = TSAssignments.Count(tsa => tsa.UserId == user.Id);
                    userTestScriptCounts[user.Id] = assignedTestScriptsCount;
                }

                var filteredUsers = users.Where(user => teamMembers.Any(tm => tm.UserId == user.Id)).ToList();

                var result = filteredUsers.Select(user => new UserLoadReport
                {
                    UserID = user.Id,
                    UserName = $"{user.UserFirstName} {user.UserSurname}",
                    NumberOfTeams = teamMembers.Where(tm => tm.UserId == user.Id).Select(tm => tm.TeamId).Distinct().Count(),
                    TeamNames = (from tm in teamMembers
                                 join team in teams on tm.TeamId equals team.TeamId
                                 where tm.UserId == user.Id
                                 select team.TeamName).Distinct().ToList(),
                    NumberOfActiveProjects = (from tm in teamMembers
                                              join team in teams on tm.TeamId equals team.TeamId
                                              join project in projects on team.TeamId equals project.TeamId
                                              where tm.UserId == user.Id && project.IsActive
                                              select project.ProjectId).Distinct().Count(),
                    ProjectNames = (from tm in teamMembers
                                    join team in teams on tm.TeamId equals team.TeamId
                                    join project in projects on team.TeamId equals project.TeamId
                                    where tm.UserId == user.Id && project.IsActive
                                    select project.ProjectName).Distinct().ToList(),
                    NumberOfTestScripts = userTestScriptCounts.ContainsKey(user.Id) ? userTestScriptCounts[user.Id] : 0
                }).ToList();

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

    }
}
