using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.DTO;
using TestScriptTracker.Models.ViewModel;
using TestScriptTracker.Repositories.Implementation;
using TestScriptTracker.Repositories.Interface;

namespace TestScriptTracker.Repositories.Implementation
{
    public class StatusRepository : IStatusRepository
    {
        private readonly AppDbContext dbContext;

        public StatusRepository(AppDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        public async Task<Status> CreateStatus(Status status)
        {
            await dbContext.Statuses.AddAsync(status);
            await dbContext.SaveChangesAsync();

            return status;
        }

        public async Task<IEnumerable<Status>> GetAllStatusesAsync()
        {
            return await dbContext.Statuses.Where(t => t.IsDeleted == false)
                                        .ToListAsync();
        }

        public async Task<Status?> GetStatusByIdAsync(Guid statusid)
        {
            return await dbContext.Statuses
                .FirstOrDefaultAsync(x => x.StatusId == statusid && x.IsDeleted == false);

        }

        public async Task<Status?> UpdateStatusAsync(Status status)
        {
            var existingStatus = await dbContext.Statuses.FirstOrDefaultAsync(x => x.StatusId == status.StatusId);

            if (existingStatus != null)
            {
                dbContext.Entry(existingStatus).CurrentValues.SetValues(status);
                await dbContext.SaveChangesAsync();
                return status;
            }

            return null;
        }

        public async Task<string> DeleteStatusAsync(Guid statusid)
        {
            var existingStatus = await dbContext.Statuses
               .FirstOrDefaultAsync(x => x.StatusId == statusid && x.IsDeleted == false);
            //Changes made by Lerato
            //var existingTestScript = await dbContext.TestScripts.FirstOrDefaultAsync(x => x.StatusId==statusid && x.IsDeleted == false);

            //if (existingTestScript != null)
            //{
            //    return "Status is associated with a Test Script";
            //}

            //else
            //{
                if (existingStatus != null)
                {
                    existingStatus.IsDeleted = true;
                    await UpdateStatusAsync(existingStatus);
                    return "Success";
                }

                return "Status not found";
            //}
        }

        public async Task<IEnumerable<StatusType>> GetAllStatusTypesAsync()
        {
            return await dbContext.StatusTypes.ToListAsync();
        }
    }
}
