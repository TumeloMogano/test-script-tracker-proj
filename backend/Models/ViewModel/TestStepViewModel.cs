using System.ComponentModel.DataAnnotations;

namespace TestScriptTracker.Models.ViewModel
{
    public class TestStepViewModel
    {
        public Guid TestStepId { get; set; }
        public string TestStepDescription { get; set; } = string.Empty;
        public string TestStepRole { get; set; } = string.Empty;
        public string TestStepName { get; set; } = string.Empty;
        public string? TestData { get; set; } = string.Empty;
        public string? AdditionalInfo { get; set; } = string.Empty;
        public string? Feedback { get; set; } = string.Empty;
        public bool IsDeleted { get; set; } = false;
        public string? Result {  get; set; } = string.Empty;
        public int? StepResultId { get; set; }
        public Guid? TestScriptId { get; set; }

        public string? StepResult { get; set;} = string.Empty;
        public string? TestScriptName {  get; set; } = string.Empty;
        //Expected Outcome
        public string? ExpectedOutcome { get; set; } = string.Empty;

    }
}
