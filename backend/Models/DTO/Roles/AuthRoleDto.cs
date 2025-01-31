using TestScriptTracker.Shared.Authorization;

namespace TestScriptTracker.Models.DTO.Roles
{
    public class AuthRoleDto
    {
        public AuthRoleDto()
        {
            RoleId = Guid.Empty;
            Name = string.Empty;
            Description = string.Empty;
            Permissions = Permissions.None;
            PermissionDescriptions = new Dictionary<long, string>();
        }

        public AuthRoleDto(Guid id, string name, string description, Permissions permissions,
            Dictionary<long, string> permissionDescriptions)
        {
            RoleId = id;
            Name = name;
            Description = description;
            Permissions = permissions;
            PermissionDescriptions = permissionDescriptions;
        }
        public Guid RoleId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Permissions Permissions { get; set; }
        public Dictionary<long, string> PermissionDescriptions { get; set; }

        public bool Has(Permissions permission)
        {
            return Permissions.HasFlag(permission); ;
        }

        public void Set(Permissions permission, bool granted)
        {
            if (granted)
            {
                Grant(permission);
            }
            else
            {
                Revoke(permission);
            }
        }

        public void Grant(Permissions permission)
        {
            Permissions |= permission;
        }

        public void Revoke(Permissions permission)
        {
            Permissions ^= permission;
        }
    }
}
