using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("AuditLog")]
    public class AuditLog
    {
        [Key]
        public Guid LogId { get; set; }
        public DateTime TimeStamp { get; set; } = DateTime.UtcNow;

        public int ActionId { get; set; }
        public Action Action { get; set; }
        public Guid? UserId { get; set; }
        public AppUser User { get; set; }
        public string Type { get; set; }  // Deprecated if using Action table
        public string TableName { get; set; }
        public string OldValues { get; set; }
        public string NewValues { get; set; }
        public string AffectedColumns { get; set; }
        public string PrimaryKey { get; set; }

    }
}
