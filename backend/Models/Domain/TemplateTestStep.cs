using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TestScriptTracker.Models.Domain
{
    [Table("TemplateTestSteps")]
    public class TemplateTestStep
    {
        [Key]
        public Guid TempTestStepId { get; set; }
        [MaxLength(500)]
        public string TempTestStepDescription { get; set; } = string.Empty;
        [MaxLength(150)]
        public string TempTestStepRole { get; set; } = string.Empty;
        public string TempTestStep { get; set; } = string.Empty;
        [MaxLength(50)]
        public string TempTestStepData { get; set; } = string.Empty;
        public string TempAdditionalInfo { get; set; } = string.Empty;
        public bool IsDeleted { get; set; } = false;
        public Guid TemplateId { get; set; }

        [JsonIgnore]
        public Template Template { get; set; }

        //public int StepOrder { get; set; }

    }

}
