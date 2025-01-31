using Microsoft.AspNetCore.Authorization;

namespace TestScriptTracker.Shared.Authorization
{
    public class DynamicAuthorizeAttribute : AuthorizeAttribute
    {
        public DynamicAuthorizeAttribute() { }
        public DynamicAuthorizeAttribute(string policy) : base(policy) { }
        public DynamicAuthorizeAttribute(Permissions permission)
        {
            Permissions = permission;
        }

        public Permissions Permissions
        {
            get
            {
                return !string.IsNullOrEmpty(Policy)
                    ? PolicyNameHelper.GetPermissionsFrom(Policy)
                    : Permissions.None;
            }
            set
            {
                Policy = value != Permissions.None
                    ? PolicyNameHelper.GeneratePolicyNameFor(value)
                    : string.Empty;
            }
        }
    }
}
