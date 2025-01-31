using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TestScriptTracker.Models.Domain
{
    [Table("TestSteps")]
    public class TestStep
    {
        [Key]
        public Guid TestStepId { get; set; }
        [MaxLength(150)]
        public string TestStepDescription { get; set; } = string.Empty;
        [MaxLength(150)]
        public string TestStepRole { get; set; } = string.Empty;
        public string TestStepName { get; set; } = string.Empty;
        [MaxLength(50)]
        public string? TestData { get; set; } = string.Empty;
        public string? AdditionalInfo { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? Feedback { get; set; }
        public bool IsDeleted { get; set; } = false;
        public int? StepResultId { get; set; }
        public Guid? TestScriptId { get; set; }
        //Expected Outcome
        public string? ExpectedOutcome { get; set; } = string.Empty;

        public StepResult? StepResult { get; set; } 
        public TestScript TestScript { get; set; }
    }
}
