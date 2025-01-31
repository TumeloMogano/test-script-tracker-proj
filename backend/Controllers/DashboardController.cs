using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using TestScriptTracker.Repositories.Implementation;
using TestScriptTracker.Repositories.Interface;

namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IReportingRepository _reportingRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly IScheduleEventRepository _eventRepository;

        public DashboardController(IReportingRepository reportingRepository, IProjectRepository projectRepository, ITeamRepository teamRepository, IScheduleEventRepository eventRepository)
        {
            _reportingRepository = reportingRepository;
            _projectRepository = projectRepository;
            _teamRepository = teamRepository;
            _eventRepository = eventRepository;
        }

        /***********************************************************************************************************************************************************************************/
        /*********************************************************************************USER DASHBOARD************************************************************************************/
        /***********************************************************************************************************************************************************************************/


        [HttpGet("GetUserTeams/{userId}")]
        public async Task<IActionResult> GetUserTeams(Guid userId)
        {
            try
            {
                var teams = await _teamRepository.GetAllTeamsAsync();
                var projects = await _projectRepository.GetAllProjectswithPhasesAsync();
                var teamMembers = await _teamRepository.GetAllTeamsMembersAsync();

                var userTeams = teamMembers
                    .Where(tm => tm.UserId == userId)
                    .Join(teams,
                          tm => tm.TeamId,
                          t => t.TeamId,
                          (tm, t) => new
                          {
                              t.TeamId,
                              t.TeamName,
                              tm.IsTeamLead,
                              ActiveProjects = projects.Count(p => p.TeamId == t.TeamId && !p.IsDeleted && p.IsActive)
                          })
                    .ToList();

                if (!userTeams.Any())
                {
                    return NotFound();
                }

                var summary = userTeams.GroupBy(ut => ut.TeamName)
                                       .Select(g => new { TeamName = g.Key, ActiveProjects = g.Sum(ut => ut.ActiveProjects) });

                return Ok(new
                {
                    Teams = userTeams,
                    Summary = summary
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing your request: " + ex.Message);
            }
        }

        [HttpGet("GetUserProjects/{userId}")]
        public async Task<IActionResult> GetUserProjects(Guid userId)
        {
            try
            {
                var projects = await _projectRepository.GetAllProjectswithPhasesAsync();
                var teamMembers = await _teamRepository.GetAllTeamsMembersAsync();
                var phases = await _reportingRepository.GetAllPhasesAsync();

                var userProjects = teamMembers
                    .Where(tm => tm.UserId == userId)
                    .Join(projects,
                          tm => tm.TeamId,
                          p => p.TeamId,
                          (tm, p) => new
                          {
                              p.ProjectId,
                              p.ProjectName,
                              CurrentPhase = phases.FirstOrDefault(ph => ph.PhaseId == p.PhaseId)?.PhaseName,
                              p.StartDate,
                              p.EndDate,
                              p.IsActive,
                              p.SignedOff,
                              p.IsDeleted
                          })
                    .Where(p => !p.IsDeleted && p.IsActive)
                    .ToList();

                if (!userProjects.Any())
                {
                    return NotFound();
                }

                var summary = userProjects.GroupBy(p => p.CurrentPhase)
                                          .Select(g => new { PhaseName = g.Key, ProjectCount = g.Count() });

                return Ok(new
                {
                    Projects = userProjects,
                    Summary = summary
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing your request: " + ex.Message);
            }
        }

        [HttpGet("GetUserTestScripts/{userId}")]
        public async Task<IActionResult> GetUserTestScripts(Guid userId)
        {
            try
            {
                var testScripts = await _reportingRepository.GetAllTestScriptsAsync();
                var TSAssignments = await _reportingRepository.GetAllTestScriptAssignmentsAsync();
                var statusTypes = await _reportingRepository.GetAllStatusTypesAsync();

                var userTestScripts = TSAssignments
                    .Where(tsa => tsa.UserId == userId)
                    .Join(testScripts,
                          tsa => tsa.TestScriptId,
                          ts => ts.TestScriptId,
                          (tsa, ts) => new
                          {
                              ts.TestScriptId,
                              ts.Process,
                              ts.TestScriptAssignment,
                              StatusType = statusTypes.FirstOrDefault(st => st.StatusTypeId == ts.StatusTypeId)?.StatusTypeName,
                              ts.DateReviewed,
                              ts.IsAssigned,
                              ts.IsDeleted
                          })
                    .Where(ts => !ts.IsDeleted)
                    .ToList();

                if (!userTestScripts.Any())
                {
                    return NotFound();
                }

                var summary = userTestScripts.GroupBy(ts => ts.StatusType)
                                             .Select(g => new { StatusType = g.Key, TestScriptCount = g.Count() });

                return Ok(new
                {
                    TestScripts = userTestScripts,
                    Summary = summary
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing your request: " + ex.Message);
            }
        }

        [HttpGet("GetUserTeamEvents/{userId}")]
        public async Task<IActionResult> GetUserTeamEvents(Guid userId)
        {
            try
            {
                var teamMembers = await _teamRepository.GetAllTeamsMembersAsync();
                var scheduleEvents = await _eventRepository.GetsAllScheduleEvents();

                var userTeamEvents = teamMembers
                    .Where(tm => tm.UserId == userId)
                    .Join(scheduleEvents,
                          tm => tm.TeamId,
                          se => se.TeamId,
                          (tm, se) => new
                          {
                              se.ScheduleEventId,
                              se.ScheduleEventName,
                              se.ScheduleEventDate,
                              se.EventTimeStart,
                              se.EventTimeEnd,
                          })
                    .Where(se => se.ScheduleEventDate >= DateTime.Now)
                    .OrderBy(se => se.ScheduleEventDate)
                    .ThenBy(se => se.EventTimeStart)
                    .ToList();

                if (!userTeamEvents.Any())
                {
                    return NotFound();
                }

                var summary = userTeamEvents.GroupBy(se => se.ScheduleEventDate.Month)
                                            .Select(g => new { Month = g.Key, EventCount = g.Count() });

                return Ok(new
                {
                    Events = userTeamEvents,
                    Summary = summary
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing your request: " + ex.Message);
            }
        }

        [HttpGet("GetUserNotifications/{userId}")]
        public async Task<IActionResult> GetUserNotifications(Guid userId)
        {
            try
            {
                var notifications = await _reportingRepository.GetAllNoticationsAsync();

                var userNotifications = notifications
                    .Where(n => n.Id == userId)
                    .OrderByDescending(n => n.NotificationDate)
                    .Select(n => new
                    {
                        n.NotificationId,
                        n.NotificationTitle,
                        n.NotificationDate
                    })
                    .ToList();

                if (!userNotifications.Any())
                {
                    return NotFound();
                }

                var summary = userNotifications.GroupBy(n => n.NotificationDate.Month)
                                               .Select(g => new { Month = g.Key, NotificationCount = g.Count() });

                return Ok(new
                {
                    Notifications = userNotifications,
                    Summary = summary
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing your request: " + ex.Message);
            }
        }

        [HttpGet("GetUserProjectTestScriptsWithDefects/{userId}")]
        public async Task<IActionResult> GetUserProjectTestScriptsWithDefects(Guid userId)
        {
            try
            {
                var testScripts = await _reportingRepository.GetAllTestScriptsAsync();
                var TSAssignments = await _reportingRepository.GetAllTestScriptAssignmentsAsync();
                var defects = await _reportingRepository.GetAllDefectsAsync();
                var projects = await _projectRepository.GetAllProjectswithPhasesAsync();
                var defectStatuses = await _reportingRepository.GetAllDefectStatusesAsync();

                var userTestScriptsWithDefects = TSAssignments
                    .Where(tsa => tsa.UserId == userId)
                    .Join(testScripts,
                          tsa => tsa.TestScriptId,
                          ts => ts.TestScriptId,
                          (tsa, ts) => new
                          {
                              ts.TestScriptId,
                              ts.Process,
                              ts.Test,
                              ts.ProjectId,
                              ProjectName = projects.FirstOrDefault(p => p.ProjectId == ts.ProjectId)?.ProjectName,
                              Defects = defects
                                  .Where(d => d.TestScriptId == ts.TestScriptId && !d.IsDeleted)
                                  .Select(d => new
                                  {
                                      d.DefectId,
                                      d.DefectDescription,
                                      d.DateLogged,
                                      DefectStatus = defectStatuses.FirstOrDefault(ds => ds.DefectStatusId == d.DefectStatusId)?.DefectStatusName
                                  }).ToList(),
                              DefectMetrics = new
                              {
                                  TotalDefects = defects.Count(d => d.TestScriptId == ts.TestScriptId && !d.IsDeleted),
                                  ResolvedDefects = defects.Count(d => d.TestScriptId == ts.TestScriptId && d.DefectStatusId == defectStatuses.FirstOrDefault(ds => ds.DefectStatusName == "Resolved")?.DefectStatusId),
                                  UnresolvedDefects = defects.Count(d => d.TestScriptId == ts.TestScriptId && d.DefectStatusId == defectStatuses.FirstOrDefault(ds => ds.DefectStatusName == "Unresolved")?.DefectStatusId),
                                  ClosedDefects = defects.Count(d => d.TestScriptId == ts.TestScriptId && d.DefectStatusId == defectStatuses.FirstOrDefault(ds => ds.DefectStatusName == "Closed")?.DefectStatusId),
                                  InProgressDefects = defects.Count(d => d.TestScriptId == ts.TestScriptId && d.DefectStatusId == defectStatuses.FirstOrDefault(ds => ds.DefectStatusName == "In Progress")?.DefectStatusId)
                              }
                          })
                    .ToList();

                if (!userTestScriptsWithDefects.Any())
                {
                    return NotFound();
                }

                return Ok(userTestScriptsWithDefects);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing your request: " + ex.Message);
            }
        }

        [HttpGet("GetTeamTestScriptsWithStatus/{userId}")]
        public async Task<IActionResult> GetTeamTestScriptsWithStatus(Guid userId, Guid? projectId = null)
        {
            try
            {
                var teamMembers = await _teamRepository.GetAllTeamsMembersAsync();
                var testScripts = await _reportingRepository.GetAllTestScriptsAsync();
                var statusTypes = await _reportingRepository.GetAllStatusTypesAsync();
                var TSAssignments = await _reportingRepository.GetAllTestScriptAssignmentsAsync();
                var projects = await _projectRepository.GetAllProjectswithPhasesAsync();

                var userTeams = teamMembers
                    .Where(tm => tm.UserId == userId)
                    .Select(tm => tm.TeamId)
                    .ToList();

                //var teamTestScripts = testScripts
                //    .Where(ts => ts.Project != null && userTeams.Contains(ts.Project.TeamId.Value) && (projectId == null || ts.ProjectId == projectId))
                //    .Select(ts => new
                //    {
                //        ts.TestScriptId,
                //        ts.Process,
                //        ts.Test,
                //        ts.ProjectId,
                //        ProjectName = projects.FirstOrDefault(p => p.ProjectId == ts.ProjectId)?.ProjectName,
                //        StatusType = statusTypes.FirstOrDefault(st => st.StatusTypeId == ts.StatusTypeId)?.StatusTypeName,
                //        IsAssigned = TSAssignments.Any(tsa => tsa.TestScriptId == ts.TestScriptId),
                //    })
                //    .ToList();

                var teamTestScripts = testScripts
                    .Where(ts => ts.Project != null && ts.Project.TeamId.HasValue && userTeams.Contains(ts.Project.TeamId.Value) && (projectId == null || ts.ProjectId == projectId))
                    .Select(ts => new
                    {
                        ts.TestScriptId,
                        ts.Process,
                        ts.Test,
                        ts.ProjectId,
                        ProjectName = projects.FirstOrDefault(p => p.ProjectId == ts.ProjectId)?.ProjectName,
                        StatusType = statusTypes.FirstOrDefault(st => st.StatusTypeId == ts.StatusTypeId)?.StatusTypeName,
                        IsAssigned = TSAssignments.Any(tsa => tsa.TestScriptId == ts.TestScriptId),
                    })
               .ToList();


                var statusMetrics = new
                {
                    Total = teamTestScripts.Count(),
                    Created = teamTestScripts.Count(ts => ts.StatusType == "Created"),
                    Submitted = teamTestScripts.Count(ts => ts.StatusType == "Submitted"),
                    InProgress = teamTestScripts.Count(ts => ts.StatusType == "In Progress"),
                    Tested = teamTestScripts.Count(ts => ts.StatusType == "Tested"),
                    Passed = teamTestScripts.Count(ts => ts.StatusType == "Passed"),
                    FailedWithDefects = teamTestScripts.Count(ts => ts.StatusType == "Failed with Defects"),
                    SignedOff = teamTestScripts.Count(ts => ts.StatusType == "Signed-Off"),
                    Failed = teamTestScripts.Count(ts => ts.StatusType == "Failed")
                };

                if (!teamTestScripts.Any())
                {
                    return NotFound();
                }

                return Ok(new
                {
                    TestScripts = teamTestScripts,
                    StatusMetrics = statusMetrics
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing your request: " + ex.Message);
            }
        }


    }
}
