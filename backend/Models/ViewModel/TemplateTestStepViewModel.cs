namespace TestScriptTracker.Models.ViewModel
{
    public class TemplateTestStepViewModel
    {
        public string TempTestStepDescription { get; set; } = string.Empty;
        public string TempTestStepRole { get; set; } = string.Empty;
        public string TempTestStep { get; set; } = string.Empty;
        public string TempTestStepData { get; set; } = string.Empty;
        public string TempAdditionalInfo { get; set; } = string.Empty;
        public Guid TemplateId { get; set; }

        //public int StepOrder { get; set; }
    }
}
