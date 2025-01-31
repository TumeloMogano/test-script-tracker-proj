using Microsoft.EntityFrameworkCore;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Repositories.Interface;

namespace TestScriptTracker.Repositories.Implementation
{
    public class PermissionRepository : IPermissionRepository
    {
        private readonly AppDbContext dbContext;

        public PermissionRepository(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<IEnumerable<Permission>> GetAllPermissionsAsync()
        {
            var permissions = await dbContext.Permissions.ToListAsync();

            return permissions;
        }
    }
}
