using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using TestScriptTracker.Repositories.Interface;
using TestScriptTracker.Shared.Authorization;

namespace TestScriptTracker.Models.Domain
{
    public class Role : IdentityRole<Guid>, ISoftDelete
    {
        [MaxLength(255)]
        public string RoleDescription { get; set; } = string.Empty;
        public bool IsDeleted { get; set; } = false;
        public virtual List<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();

        //Helper method to calculate permissions based on RolePermissions
        public Permissions Permissions
        {
            get
            {
                Permissions permissions = Permissions.None;
                foreach (var rolePermission in RolePermissions)
                {
                    permissions |= rolePermission.Permission.PermissionEnum;
                }
                return permissions;
            }
        }
    }
}
