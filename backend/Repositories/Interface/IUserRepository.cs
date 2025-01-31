using Microsoft.EntityFrameworkCore;
using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Repositories.Interface
{
    public interface IUserRepository
    {
        //Create a new User
        Task<User> RegistrationRAsync(User user);
        //Create a new User(identity)
        Task<AppUser> RegistrationRRAsync(AppUser appuser);

        //Create a new User's username & password
        Task RegisterUserAsync(User user);
        //Create a new User's username & password(identity)
        Task RegisterUsersAsync(AppUser appuser);
        //RegisterClientReps (identity)
        Task<AppUser> RegisterClientsRepAsync(AppUser appuser);

        //List of all Users
        Task<IEnumerable<User>> GetAllUsersAsync();
        //List of all Users(identity)
        Task<IEnumerable<AppUser>> GetsAllUsersAsync();

        //List of all Registration requests
        Task<IEnumerable<User>> GetRequestsAsync();
        //List of all Registration requests(identity)
        Task<IEnumerable<AppUser>> GetsRequestsAsync();

        //Approve requests
        Task ApproveRequestAsync(User user);
        //Approve requests(identity)
        Task ApproveRequestsAsync(AppUser appuser);

        //Generate Code
        Task<string> GenerateCodeAsync();

        //Search User 
        Task<User?> GetUserByIdAsync(Guid userid);
        Task<User?> GetUserByEmailAsync(string useremail);

        //Search User(identity)
        //Task<AppUser?> GetsUserByIdAsync(int userid);
        Task<AppUser?> GetUsersByEmailAsync(string useremail);
        Task<AppUser?> GetUsersByIdAsync(Guid userid);
        Task<ClientRepresentative?> GetCRepsByEmailAsync(string email);
        //Update User details
        Task UpdateUserAsync(User user);
        //Update User details(identity)
        Task UpdateUsersAsync(AppUser appuser);

        //Delete / Remove User
        Task RemoveUserAsync(User user);
        //Delete / Remove User(identity)
        Task RemoveUsersAsync(AppUser appuser);
        //###################RESTRICTED DELETE#########################
        Task<bool> HasDependenciesAsync(Guid userid);
        Task<AppUser> DeleteUserAsync(Guid userid);

        //login
        Task<User> FindByUsernameAsync(string LoginUsername);

        //forgot password
        Task<User> FirstEmailAsync(string userEmailAddress);
        Task<User> GetUserByEmailAddressAsync(string userEmailAddress);

        //reset password
        Task<User> GetUserByUsernameAsync(string username);
        Task<User> GetUserByLoginUsernameAsync(string LoginUsername);



        //Nosipho 
        Task<AppUser> FindByIdAsync(Guid userId);
        Task<IEnumerable<AppUser>> SearchUsersByUsernameAsync(string userFirstName);


        Task<AppUser?> GetUserDetailsAsync(string email);

    }
}
