namespace TestScriptTracker.Models.ViewModel
{
    public class TestStepResultViewModel
    {
        public Guid TestStepId { get; set; }
        public int StepResultId { get; set; }
        public string? Feedback { get; set; } // Default feedback to null
    }
}
