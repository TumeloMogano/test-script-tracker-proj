using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.DTO.Team;

namespace TestScriptTracker.Repositories.Interface
{
    public interface ITeamRepository
    {
        Task<Team> CreateTeamAsync(Team team);

        Task<IEnumerable<Team>> GetAllTeamsAsync();

        Task<Team?> GetTeamByIdAsync(Guid teamid);

        Task<Team?> UpdateTeamAsync(Team team);

        Task<Team?> DeleteTeamAsync(Guid teamid);
        Task<bool> HasDependenciesAsync(Guid teamid);
        Task<bool> DeleteTeamsAsync(Guid teamid);

        Task<IEnumerable<AppUser>> GetAvailableUsersForTeamAsync(Guid teamId);

        Task<IEnumerable<TeamMembers>> AddTeamMembers(Guid teamid, List<NewTeamMemberDto> teamMembers);
        Task<IEnumerable<TeamMembers>> GetTeamMembersAsync(Guid teamid);
        Task<TeamMembers?> RemoveTeamMember(Guid teamid, Guid userid);
        Task<TeamMembers?> UpdateMemberLeadership(Guid teamid, Guid userid, bool isTeamLead);
        Task<IEnumerable<Team>> GetFilteredTeamsForUserAsync(Guid userId);
        Task<bool> CheckIsTeamLeadAsync(Guid userId, Guid projectId);
        Task<bool> CanAddTeamLeadAsync(Guid teamId);
        Task<bool> CanAddMemberToTeamAsync(Guid teamId);

        //NEW METHODS
        Task<TeamMembers[]> GetAllTeamsMembersAsync();
    }
}
