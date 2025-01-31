using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Repositories.Interface;
using System;
using SkiaSharp;

namespace TestScriptTracker.Repositories.Implementation
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly AppDbContext dbContext;
        public ProjectRepository(AppDbContext _dbContext)
        {
            dbContext = _dbContext;
        }
        public async Task<Project> CreateProject(Project project)
        {
            await dbContext.Projects.AddAsync(project);
            await dbContext.SaveChangesAsync();

            return project;
        }

        public async Task<Project[]> GetAllProjectsAsync()
        {

            IQueryable<Project> query = dbContext.Projects.Include(x => x.Phase);
            return await query.ToArrayAsync();
        }

        public async Task<Project[]> GetAllProjectswithClientAsync()
        {

            IQueryable<Project> query = dbContext.Projects.Include(x => x.Client).Include(x => x.Phase);
            return await query.ToArrayAsync();
        }

        public async Task<Project[]> GetAllProjectswithPhasesAsync()
        {
            IQueryable<Project> query = dbContext.Projects.Include(p => p.Phase);
            return await query.ToArrayAsync();
        }

        public async Task<Project> GetProjectByIdAsync(Guid projectId)
        {
            IQueryable<Project> newquery = dbContext.Projects.Include(x => x.Phase).Where(p => p.ProjectId == projectId);
            return await newquery.FirstOrDefaultAsync();
        }

        public async Task<Project[]> GetClientProjects(Guid clientId)
        {
            IQueryable<Project> newquery = dbContext.Projects.Include(x => x.Phase).Where(c => c.ClientId == clientId);
            return await newquery.ToArrayAsync();
        }

        public async Task<Project[]> GetTeamProjects(Guid teamId)
        {
            IQueryable<Project> newquery = dbContext.Projects.Include(x => x.Phase).Where(c => c.TeamId == teamId);
            return await newquery.ToArrayAsync();
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await dbContext.SaveChangesAsync() > 0;
        }

        public void DeleteProject<T>(T entity) where T : class
        {
            dbContext.Remove(entity);
        }

        public async Task<Project?> AssignTeamToProject(Guid projectId, Guid teamId)
        {
            var project = await dbContext.Projects.FindAsync(projectId);

            if (project == null)
                return null; //Project not found

            project.TeamId = teamId;
            await dbContext.SaveChangesAsync();
            return project;
        }

        public async Task<IEnumerable<Project>> GetProjectsByClientRepEmailAsync(string clientRepEmail)
        {
            return await dbContext.Projects.Include(x => x.Phase)
                .Where(p => p.ResponsibleClientRep == clientRepEmail)
                .ToListAsync();
        }


        //###################RESTRICTED DELETE#########################
        public async Task<bool> HasDependenciesAsync(Guid projectId)
        {
            var hasDependencies = await dbContext.TestScripts.AnyAsync(ts => ts.ProjectId == projectId) ||
                                  await dbContext.Notifications.AnyAsync(n => n.ProjectId == projectId) ||
                                  await dbContext.Statuses.AnyAsync(s => s.ProjectId == projectId);

            return hasDependencies;
        }

        public async Task<Project> DeleteProjectAsync(Guid projectId)
        {
            var project = await dbContext.Projects.FindAsync(projectId);
            if (project == null)
            {
                return null;
            }

            dbContext.Projects.Remove(project);
            await dbContext.SaveChangesAsync();
            return project;
        }
    }
}
