using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TestScriptTracker.Models.Domain
{
    [Table("StatusTypes")]
    public class StatusType
    {
        [Key]
        public int StatusTypeId { get; set; }
        [MaxLength(30)]
        public string StatusTypeName { get; set; } = string.Empty;

        public List<Status>? Statuses { get; set; }
        public List<TestScript>? TestScripts { get; set; }

    }
}
