using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TestScriptTracker.Models.Domain
{
    [Table("Templates")]
    public class Template
    {
        [Key]
        public Guid TemplateId { get; set; }
        [MaxLength(150)]
        public string TemplateName { get; set; } = string.Empty;
        [MaxLength(150)]
        public string TemplateTest { get; set; } = string.Empty;
        [MaxLength(255)]
        public string TemplateDescription { get; set; } = string.Empty;
        public DateTime TempCreateDate { get; set; }
        public bool IsDeleted { get; set; } = false;
        public string? Feedback { get; set; }
        public int TempStatusId { get; set; }

        [ForeignKey("TempStatusId")]
        public TemplateStatus TemplateStatus { get; set; }
        public List<TemplateTestStep> TemplateTestSteps { get; set; }
        public List<TestScript> TestScripts { get; set; }

    }
}
