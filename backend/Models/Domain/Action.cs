using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("Action")]
    public class Action
    {
        [Key]
        //public int ActionId { get; set; }
        // [MaxLength(50)]

        public int ActionId { get; set; }
        [MaxLength(50)]
        public string ActionName { get; set; }

        // Navigation property
        public ICollection<AuditLog> AuditLogs { get; set; }
    }
}

//public enum Action
//{
//    None = 0,
//    Create = 1, 
//    Update = 2, 
//    Delete = 3
//}