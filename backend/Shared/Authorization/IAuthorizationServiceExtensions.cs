using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace TestScriptTracker.Shared.Authorization
{
    public static class IAuthorizationServiceExtensions
    {
        public static Task<AuthorizationResult> AuthorizeAsync(
            this IAuthorizationService service, ClaimsPrincipal user, Permissions permission)
        {
            return service.AuthorizeAsync(user, PolicyNameHelper.GeneratePolicyNameFor(permission));
        }
    }
}
