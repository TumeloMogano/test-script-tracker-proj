using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Repositories.Interface;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace TestScriptTracker.Repositories.Implementation
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext dbContext;

        private readonly UserManager<AppUser> userManager;

        public UserRepository(AppDbContext _dbContext, UserManager<AppUser> userManager)
        {
            dbContext = _dbContext;
            this.userManager = userManager;

        }
        //Create a new User
        public async Task<User> RegistrationRAsync(User user)
        {
            await dbContext.User.AddAsync(user);
            await dbContext.SaveChangesAsync();

            return user;
        }

        //Create a new User(identity)
        public async Task<AppUser> RegistrationRRAsync(AppUser appuser)
        {
            await dbContext.AppUsers.AddAsync(appuser);
            await dbContext.SaveChangesAsync();

            return appuser;
        }

        //Create a new User's username & password
        public async Task RegisterUserAsync(User user)
        {
            dbContext.Entry(user).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
        }
        public async Task RegisterClientRepAsync(User user)
        {
            dbContext.Entry(user).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
        }
        //Create a new User's username & password(identity)
        public async Task RegisterUsersAsync(AppUser appuser)
        {
            dbContext.Entry(appuser).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
        }
        public async Task<AppUser> RegisterClientsRepAsync(AppUser appuser)
        {
            //dbContext.Entry(appuser).State = EntityState.Modified;
            //await dbContext.SaveChangesAsync();
            await dbContext.AppUsers.AddAsync(appuser);
            await dbContext.SaveChangesAsync();

            return appuser;
        }
        //List of all Users 
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await dbContext.User.Include(u => u.RegistrationStatus).ToListAsync();
        }
        //List of all Users(identity)
        //public async Task<IEnumerable<AppUser>> GetsAllUsersAsync()
        //{
        //    return await dbContext.AppUsers.ToListAsync();
        //}
        public async Task<IEnumerable<AppUser>> GetsAllUsersAsync()
        {
            return await dbContext.AppUsers.Include(au => au.RegistrationStatus).ToListAsync();
        }

        //List of all Registration requests
        public async Task<IEnumerable<User>> GetRequestsAsync()
        {
            return await dbContext.User.Where(x => x.RegStatusId == 1).ToListAsync();
        }
        //List of all Registration requests(identity)
        public async Task<IEnumerable<AppUser>> GetsRequestsAsync()
        {
            return await dbContext.AppUsers.Where(x => x.RegStatusId == 1).ToListAsync();
        }

        //Approve requests
        public async Task ApproveRequestAsync(User user)
        {
            dbContext.Entry(user).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
        }

        //Approve requests(identity)
        public async Task ApproveRequestsAsync(AppUser appuser)
        {
            dbContext.Entry(appuser).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
        }
        //Generate Code
        public async Task<string> GenerateCodeAsync()
        {
            string code;
            bool exists;

            do
            {
                code = GenerateRandomCode();
                exists = await dbContext.AppUsers.AnyAsync(u => u.RegistrationCode == code);
            } while (exists);

            return code;
        }
        private string GenerateRandomCode()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 5)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        
        //Search User 
        public async Task<User?> GetUserByIdAsync(Guid userid)
        {
            return await dbContext.User.SingleOrDefaultAsync(x => x.UserId == userid);
        }
        //Search User BY EMAIL
        public async Task<User?> GetUserByEmailAsync(string useremail)
        {
            return await dbContext.User.FirstOrDefaultAsync(x => x.UserEmailAddress == useremail);
        }
        //Search User (identity)
        public async Task<AppUser?> GetUsersByIdAsync(Guid userid)
        {
            return await dbContext.AppUsers.SingleOrDefaultAsync(x => x.Id == userid);
        }
        //Search User BY EMAIL(identity)
        public async Task<AppUser?> GetUsersByEmailAsync(string useremail)
        {
            return await dbContext.AppUsers.FirstOrDefaultAsync(x => x.Email == useremail);
        }
        //Search CRep BY EMAIL
        public async Task<ClientRepresentative?> GetCRepsByEmailAsync(string useremail)
        {
            return await dbContext.ClientRepresentatives.FirstOrDefaultAsync(x => x.RepEmailAddress == useremail);
        }

        //Update User details
        public async Task UpdateUserAsync(User user)
        {
            dbContext.Entry(user).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
        }
        //Update User details(identity)
        public async Task UpdateUsersAsync(AppUser appuser)
        {
            dbContext.Entry(appuser).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
        }

        //Delete / Remove User
        public async Task RemoveUserAsync(User user)
        {
            dbContext.User.Remove(user);
            await dbContext.SaveChangesAsync();
        }

        //Delete / Remove User
        public async Task RemoveUsersAsync(AppUser appuser)
        {
            dbContext.AppUsers.Remove(appuser);
            await dbContext.SaveChangesAsync();
        }

        //###################RESTRICTED DELETE#########################
        public async Task<bool> HasDependenciesAsync(Guid userid)
        {
            var hasDependencies = await dbContext.TeamMembers.AnyAsync(ts => ts.UserId == userid) ||
                                  await dbContext.UserRoles.AnyAsync(n => n.UserId == userid) ||
                                  await dbContext.TestScriptAssignments.AnyAsync(s => s.UserId == userid) ||
                                  await dbContext.AuditLog.AnyAsync(a => a.UserId == userid) ||
                                  await dbContext.ClientRepresentatives.AnyAsync(c => c.UserId == userid) ||
                                  await dbContext.Notifications.AnyAsync(f => f.Id == userid);

            return hasDependencies;
        }

        public async Task<AppUser> DeleteUserAsync(Guid userid)
        {
            var user = await dbContext.AppUsers.FindAsync(userid);
            if (user == null)
            {
                return null;
            }

            dbContext.AppUsers.Remove(user);
            await dbContext.SaveChangesAsync();
            return user;
        }

        //login
        public async Task<User> FindByUsernameAsync(string LoginUsername)
        {
            return await dbContext.User.SingleOrDefaultAsync(u => u.LoginUserName == LoginUsername);
        }


        //forgot password 
        public async Task<User> GetUserByEmailAddressAsync(string userEmailAddress)
        {
            return await dbContext.User.SingleOrDefaultAsync(u => u.UserEmailAddress == userEmailAddress);
        }

        public async Task<User> FirstEmailAsync(string userEmailAddress)
        {
            return await dbContext.User.FirstOrDefaultAsync(u => u.UserEmailAddress == userEmailAddress);
        }



        //reset password
        public async Task<User> GetUserByIdAsync(string id)
        {
            return await dbContext.User.FindAsync(id);
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return await dbContext.User.SingleOrDefaultAsync(u => u.LoginUserName == username);
        }
        public async Task<User> GetUserByLoginUsernameAsync(string LoginUsername)
        {
            var user = await dbContext.User.FirstOrDefaultAsync(u => u.LoginUserName == LoginUsername);
            return user;
        }



        //Nosipho
        public async Task<AppUser> FindByIdAsync(Guid userId)
        {
          return await userManager.FindByIdAsync(userId.ToString());
        }

        public async Task<IEnumerable<AppUser>> SearchUsersByUsernameAsync(string UserFirstName)
        {
            return await userManager.Users
                .Where(u => u.UserFirstName.Contains(UserFirstName))
                .ToListAsync();
        }

       



        public async Task<AppUser?> GetUserDetailsAsync(string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null) 
            {
                return null;
            }

            return user;
        }

    }
}

