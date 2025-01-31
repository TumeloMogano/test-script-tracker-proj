using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("DefectStatus")]
    public class DefectStatus
    {
        [Key]
        public int DefectStatusId { get; set; }
        [MaxLength(50)]
        public string DefectStatusName { get; set; } = string.Empty;
        public List<Defect>? Defects { get; set; }
    }
}
