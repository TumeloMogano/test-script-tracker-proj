namespace TestScriptTracker.Models.ViewModel
{
    public class DefectAddViewModel
    {
        public string DefectDescription { get; set; } = string.Empty;
        public Guid? TestScriptId { get; set; }
        public string UserEmailAddress { get; set; } = string.Empty;
        public string? DefectImage { get; set; }
    }
}
