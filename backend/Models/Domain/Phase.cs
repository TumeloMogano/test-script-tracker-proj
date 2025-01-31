using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("Phases")]
    public class Phase
    {
        [Key]
        public int PhaseId { get; set; }
        [MaxLength(50)]
        public string PhaseName { get; set; } = string.Empty;
        [MaxLength(50)]
        public string PhaseDescription { get; set; } = string.Empty;
        public List<Project>? Projects { get; set; }

    }
}
