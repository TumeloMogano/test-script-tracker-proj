using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TestScriptTracker.Models.Domain
{
    [Table("StepResults")]
    public class StepResult
    {
        [Key]
        public int StepResultId { get; set; }
        [MaxLength(50)]
        public string StepResultName { get; set; } = string.Empty;

        public List<TestStep>? TestSteps { get; set; }
    }
}
