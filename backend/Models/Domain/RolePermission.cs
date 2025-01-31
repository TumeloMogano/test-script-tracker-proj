using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("RolePermissions")]
    public class RolePermission
    {
        [Key, Column(Order = 0)]
        public Guid RoleId { get; set; }
        public Role Role { get; set; }

        [Key, Column(Order = 1)]
        public Guid PermissionId { get; set; }
        public Permission Permission { get; set; }
    }
}
