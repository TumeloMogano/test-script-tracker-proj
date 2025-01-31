using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Repositories.Interface
{
    public interface IProjectRepository
    {
        Task<Project> CreateProject(Project project);

        Task<Project[]> GetAllProjectsAsync();
        Task<Project[]> GetAllProjectswithClientAsync();

        Task<Project[]> GetAllProjectswithPhasesAsync();

        Task<Project> GetProjectByIdAsync(Guid projectId);

        Task<Project[]> GetClientProjects(Guid clientId);

        Task<Project[]> GetTeamProjects(Guid clientId);

        Task<bool> SaveChangesAsync();

        void DeleteProject<T>(T entity) where T : class;

        public Task<Project?> AssignTeamToProject(Guid projectId, Guid teamId);

        Task<IEnumerable<Project>> GetProjectsByClientRepEmailAsync(string clientRepEmail);

        //###################RESTRICTED DELETE#########################
        Task<bool> HasDependenciesAsync(Guid projectId);
        Task<Project> DeleteProjectAsync(Guid projectId);
    }
}
