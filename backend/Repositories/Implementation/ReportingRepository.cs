using Microsoft.EntityFrameworkCore;
using System.Dynamic;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Repositories.Interface;

namespace TestScriptTracker.Repositories.Implementation
{
    public class ReportingRepository : IReportingRepository
    {

        private readonly AppDbContext _context;

        public ReportingRepository(AppDbContext _dbContext)
        {
            _context = _dbContext;
        }

        public async Task<AppUser[]> GetAllAppUsersAsync()
        {
            return await _context.Users.ToArrayAsync();
        }

        public async Task<Project[]> GetAllProjectsAsync()
        {
            return await _context.Projects
                .Include(p => p.Client)
                .Include(p => p.Team)
                .Include(p => p.Phase)
            .ToArrayAsync();
        }

        public async Task<Project[]> GetAllActiveProjectsAsync()
        {
            return await _context.Projects.Where(p => p.IsActive == true).ToArrayAsync();
        }

        public async Task<Client[]> GetAllClientsAsync()
        {
            return await _context.Clients.ToArrayAsync();
        }

        public async Task<Template[]> GetAllTemplatesAsync()
        {
            return await _context.Templates
                .Include(t => t.TemplateStatus)
            .ToArrayAsync();
        }

        public async Task<Team[]> GetAllTeamsAsync()
        {
            return await _context.Teams.ToArrayAsync();
        }

        public async Task<TeamMembers[]> GetAllTeamMembersAsync()
        {
            return await _context.TeamMembers.ToArrayAsync();
        }

        public async Task<Defect[]> GetAllDefectsAsync()
        {
            return await _context.Defects.Include(d => d.TestScript).ToArrayAsync();
        }

        public async Task<TestScript[]> GetAllTestScriptsAsync()
        {
            return await _context.TestScripts
                .Include(ts => ts.StatusType)
                .Include(ts => ts.Project)
                .Include(ts => ts.Template)
                .ToArrayAsync();
        }

        public async Task<TestScriptAssignment[]> GetAllTestScriptAssignmentsAsync()
        {
            return await _context.TestScriptAssignments.ToArrayAsync();
        }

        public async Task<ClientRepresentative[]> GetAllClientRepresentativesAsync()
        {
            return await _context.ClientRepresentatives
                .Include(cr => cr.Client)
                .Include(cr => cr.User)
                .ToArrayAsync();
        }

        public async Task<Status[]> GetAllStatusesAsync()
        {
            return await _context.Statuses.ToArrayAsync();
        }

        public async Task<StatusType[]> GetAllStatusTypesAsync()
        {
            return await _context.StatusTypes.ToArrayAsync();
        }

        public async Task<RegistrationStatus[]> GetAllRegStatusesAsync()
        {
            return await _context.RegistrationStatus.ToArrayAsync();
        }

        public async Task<DefectStatus[]> GetAllDefectStatusesAsync()
        {
            return await _context.DefectStatus.ToArrayAsync();
        }

        public async Task<Phase[]> GetAllPhasesAsync()
        {
            return await _context.Phases.ToArrayAsync();
        }

        public async Task<Notification[]> GetAllNoticationsAsync()
        {
            return await _context.Notifications.ToArrayAsync();
        }

    }
}
