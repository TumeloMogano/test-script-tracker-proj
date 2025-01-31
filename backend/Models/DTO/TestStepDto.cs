namespace TestScriptTracker.Models.DTO
{
    public class TestStepDto
    {
        public string TestStepDescription { get; set; } = string.Empty;
        public string TestStepRole { get; set; } = string.Empty;
        public string TestStepName { get; set; } = string.Empty;
        public string TestData { get; set; } = string.Empty;
        public string AdditionalInfo { get; set; } = string.Empty;
        public string ExpectedOutcome { get; set; } = string.Empty;

        public Guid? TestScriptId { get; set; }

    }
}
