using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TestScriptTracker.Shared.Authorization;

namespace TestScriptTracker.Models.Domain
{
    [Table("Permissions")]
    public class Permission
    {
        [Key]
        public Guid PermissionId { get; set; }
        [MaxLength(50)]
        public string PermissionName { get; set; } = string.Empty;
        public string PermissionDescription { get; set; } = string.Empty;
        public List<RolePermission> RolePermissions { get; set; }

        [NotMapped]
        public Permissions PermissionEnum
        {
            get => Enum.Parse<Permissions>(PermissionName);
            set => PermissionName = value.ToString();
        }
    }
}
