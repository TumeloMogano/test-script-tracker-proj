using System.ComponentModel.DataAnnotations;

namespace TestScriptTracker.Models.ViewModel
{
    public class TestScriptViewModel
    {
        public Guid TestScriptId { get; set; }
        public string Process { get; set; } = string.Empty;
        public string Test { get; set; } = string.Empty;
        public string TestScriptDescription { get; set; } = string.Empty;
        public DateTime DateReviewed { get; set; }
        public int Version { get; set; }
        public bool IsDeleted { get; set; } = false;
        public bool IsAssigned {  get; set; } = false;
        public string StatusNameDisplayed { get; set; } = string.Empty;
        public string? AssignedUser { get; set; } = string.Empty;
        public Guid ProjectId { get; set; }
        public int StatusTypeId { get; set; }
        public Guid TemplateId { get; set; }
        public string? StatusType { get; set; } = string.Empty;
        public string? Project { get; set; } = string.Empty;
        public string? Template { get; set; } = string.Empty;

    }
}
