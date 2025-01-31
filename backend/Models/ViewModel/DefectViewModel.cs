namespace TestScriptTracker.Models.ViewModel
{
    public class DefectViewModel
    {
        public Guid DefectId { get; set; }
        public string DefectDescription { get; set; } = string.Empty;
        public DateTime DateLogged { get; set; }
        public bool IsDeleted { get; set; } = false;
        public int? DefectStatusId { get; set; }
        public Guid? TestScriptId { get; set; }
        public string UserEmailAddress { get; set; } = string.Empty;
        public string? DefectImage { get; set; }
        public string DefectStatus { get; set; } = string.Empty;
        public string TestScriptName { get; set; } = string.Empty;
    }
}
