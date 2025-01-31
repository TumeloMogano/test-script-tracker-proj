using System.Dynamic;
using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Repositories.Interface
{
    public interface IReportingRepository
    {
        Task<AppUser[]> GetAllAppUsersAsync();
        Task<Project[]> GetAllProjectsAsync();
        Task<Project[]> GetAllActiveProjectsAsync();
        Task<Client[]> GetAllClientsAsync();
        Task<Template[]> GetAllTemplatesAsync();
        Task<Team[]> GetAllTeamsAsync();
        Task<TeamMembers[]> GetAllTeamMembersAsync();
        Task<Defect[]> GetAllDefectsAsync();
        Task<TestScript[]> GetAllTestScriptsAsync();
        Task<TestScriptAssignment[]> GetAllTestScriptAssignmentsAsync();
        Task<ClientRepresentative[]> GetAllClientRepresentativesAsync();
        Task<Status[]> GetAllStatusesAsync();
        Task<StatusType[]> GetAllStatusTypesAsync();
        Task<RegistrationStatus[]> GetAllRegStatusesAsync();
        Task<DefectStatus[]> GetAllDefectStatusesAsync();
        Task<Phase[]> GetAllPhasesAsync();
        Task<Notification[]> GetAllNoticationsAsync();
        //Task<List<ExpandoObject>> GetJoinedDataAsync(List<string> tables, Dictionary<string, List<string>> selectedAttributes);
    }
}
