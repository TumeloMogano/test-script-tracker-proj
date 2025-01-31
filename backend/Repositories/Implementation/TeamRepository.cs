using Microsoft.EntityFrameworkCore;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.DTO.Team;
using TestScriptTracker.Repositories.Interface;

namespace TestScriptTracker.Repositories.Implementation
{
    public class TeamRepository : ITeamRepository
    {
        private readonly AppDbContext dbContext;

        public TeamRepository(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Team> CreateTeamAsync(Team team)
        {
            await dbContext.Teams.AddAsync(team);
            await dbContext.SaveChangesAsync();

            return team;
        }

        public async Task<IEnumerable<Team>> GetAllTeamsAsync()
        {

            //Stored procedure
            return await dbContext.Teams.FromSqlRaw("EXEC GetAllTeams")
                                        .ToListAsync();
        }

        public async Task<Team?> GetTeamByIdAsync(Guid teamid)
        {
            return await dbContext.Teams
                .FirstOrDefaultAsync(x => x.TeamId == teamid && x.IsDeleted == false);

            //return await dbContext.Teams.FirstOrDefaultAsync(x => x.TeamId == teamid);
        }

        public async Task<Team?> UpdateTeamAsync(Team team)
        {
            var existingTeam = await dbContext.Teams.FirstOrDefaultAsync(x => x.TeamId == team.TeamId && x.IsDeleted == false);

            if (existingTeam != null)
            {
                dbContext.Entry(existingTeam).CurrentValues.SetValues(team);
                await dbContext.SaveChangesAsync();
                return team;
            }

            return null;
        }

        public async Task<Team?> DeleteTeamAsync(Guid teamid)
        {
            var existingTeam = await dbContext.Teams
               .FirstOrDefaultAsync(x => x.TeamId == teamid && x.IsDeleted == false);

            if (existingTeam is null)
            {
                return null;
            }

            dbContext.Teams.Remove(existingTeam);
            await dbContext.SaveChangesAsync();
            return existingTeam;
        }

        public async Task<IEnumerable<TeamMembers>> AddTeamMembers(
            Guid teamid, List<NewTeamMemberDto> teamMembers)
        {

            var addedMembers = new List<TeamMembers>();

            foreach (var member in teamMembers)
            {
                var teamMember = new TeamMembers
                {
                    TeamId = teamid,
                    UserId = member.UserId,
                    IsTeamLead = member.IsTeamLead
                };

                await dbContext.TeamMembers.AddAsync(teamMember);
                addedMembers.Add(teamMember);
            }

            await dbContext.SaveChangesAsync();

            return addedMembers;
        }

        public async Task<TeamMembers?> RemoveTeamMember(Guid teamid, Guid userid)
        {
            var teamMember = await dbContext.TeamMembers
                .FirstOrDefaultAsync(x => x.TeamId == teamid && x.UserId == userid);

            if (teamMember is null)
            {
                return null;
            }

            dbContext.TeamMembers.Remove(teamMember);
            await dbContext.SaveChangesAsync();

            return teamMember;
        }

        public async Task<TeamMembers?> UpdateMemberLeadership(Guid teamid, Guid userid, bool isTeamLead)
        {
            var teamMember = await dbContext.TeamMembers
                .FirstOrDefaultAsync(x => x.TeamId == teamid && x.UserId == userid);

            if (teamMember is null)
            {
                return null;
            }

            teamMember.IsTeamLead = isTeamLead;
            await dbContext.SaveChangesAsync();

            return teamMember;
        }

        public async Task<IEnumerable<TeamMembers>> GetTeamMembersAsync(Guid teamid)
        {
            return await dbContext.TeamMembers
                .Include(x => x.User)
                .Where(x => x.TeamId == teamid)
                .ToListAsync();
        }
        public async Task<IEnumerable<AppUser>> GetAvailableUsersForTeamAsync(Guid teamId)
        {
            var users = await dbContext.AppUsers
                .Where(u => !dbContext.TeamMembers
                    .Any(tm => tm.TeamId == teamId && tm.UserId == u.Id) 
                    && !dbContext.ClientRepresentatives
                        .Any(cr => cr.UserId == u.Id)
                    && u.RegStatusId == 4
                    && u.IsDeleted == false)
                .ToListAsync();

            return users;
        }

        public async Task<bool> HasDependenciesAsync(Guid teamid)
        {
            var hasDependencies = await dbContext.Projects.AnyAsync(p => p.TeamId == teamid) ||
                await dbContext.TeamMembers.AnyAsync(tm => tm.TeamId == teamid) ||
                await dbContext.ScheduleEvents.AnyAsync(se => se.TeamId == teamid) ||
                await dbContext.TestScriptAssignments.AnyAsync(tsa => tsa.TeamId == teamid);

            return hasDependencies;
        }

        public async Task<bool> DeleteTeamsAsync(Guid teamid)
        {
            var team = await dbContext.Teams.FindAsync(teamid);

            if (team == null)
            {
                return false;
            }

            dbContext.Teams.Remove(team);
            await dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CheckIsTeamLeadAsync(Guid userId, Guid projectId)
        {
             return await dbContext.TeamMembers
                .Where(tm => tm.UserId == userId && tm.IsTeamLead == true)
                .Join(dbContext.Teams, tm => tm.TeamId, t => t.TeamId, (tm, t) => new { tm, t })
                .Join(dbContext.Projects, combined => combined.t.TeamId, p => p.TeamId, (combined, p) => new { combined.tm, p })
                .AnyAsync(joined => joined.p.ProjectId == projectId && joined.tm.IsTeamLead == true);         
        }

        public async Task<bool> CanAddTeamLeadAsync(Guid teamId)
        {
            return !await dbContext.TeamMembers
                .AnyAsync(tm => tm.TeamId == teamId && tm.IsTeamLead == true);
        }

        public async Task<bool> CanAddMemberToTeamAsync(Guid teamId)
        {
            //Check if the team already has 10 members
            return await dbContext.TeamMembers.CountAsync(tm => tm.TeamId == teamId) < 6;
        }


        //NEW METHODS
        public async Task<TeamMembers[]> GetAllTeamsMembersAsync()
        {

            IQueryable<TeamMembers> query = dbContext.TeamMembers;
            return await query.ToArrayAsync();
        }

        public async Task<IEnumerable<Team>> GetFilteredTeamsForUserAsync(Guid userId)
        {
            return await dbContext.TeamMembers
                .Where(tm => tm.UserId == userId && tm.Team.IsDeleted == false)
                .Select(tm => tm.Team)
                .ToListAsync();
        }
    }
}
