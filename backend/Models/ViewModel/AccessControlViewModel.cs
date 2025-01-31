using TestScriptTracker.Models.DTO.Roles;
using TestScriptTracker.Shared.Authorization;

namespace TestScriptTracker.Models.ViewModel
{
    public class AccessControlViewModel
    {
        internal AccessControlViewModel() { }

        public AccessControlViewModel(List<AuthRoleDto> roles)
        {
            Roles = roles;

            foreach (var permission in PermissionsProvider.GetAll())
            {
                if (permission == Permissions.None) continue;

                AvailablePermissions.Add(permission);
            }
        }

        public List<AuthRoleDto> Roles { get; set; } = new();
        public List<Permissions> AvailablePermissions { get; set; } = new();
    }
}
