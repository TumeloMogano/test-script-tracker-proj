using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Models.DTO
{
    public class TemplateDto
    {
        public Guid TemplateId { get; set; }
        public string TemplateName { get; set; } = string.Empty;
        public string TemplateTest { get; set; } = string.Empty;
        public string TemplateDescription { get; set; } = string.Empty;
        public DateTime TempCreateDate { get; set; }
        public bool IsDeleted { get; set; } = false;
        public int TempStatusId { get; set; }
        public string TemplateStatusName { get; set; } = string.Empty;
        public string? Feedback { get; set; }
    }
}
