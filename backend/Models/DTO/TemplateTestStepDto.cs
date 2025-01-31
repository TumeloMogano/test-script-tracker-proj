using System.ComponentModel.DataAnnotations;
using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Models.DTO
{
    public class TemplateTestStepDto
    {
        public Guid TempTestStepId { get; set; }
        public string TempTestStepDescription { get; set; } = string.Empty;
        public string TempTestStepRole { get; set; } = string.Empty;
        public string TempTestStep { get; set; } = string.Empty;
        public string TempTestStepData { get; set; } = string.Empty;
        public string TempAdditionalInfo { get; set; } = string.Empty;
        public bool IsDeleted { get; set; } = false;
        public Guid TemplateId { get; set; }

        //public int StepOrder { get; set; }

    }
}
