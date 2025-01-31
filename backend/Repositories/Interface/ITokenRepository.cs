using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Repositories.Interface
{
    public interface ITokenRepository
    {
        Task<string> CreateJwtToken(AppUser user);
    }
}
