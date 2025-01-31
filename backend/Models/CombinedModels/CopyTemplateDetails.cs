using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.DTO;

namespace TestScriptTracker.Models.CombinedModels
{
    public class CopyTemplateDetails
    {
        public TemplateDto Template { get; set; }
        public List<TemplateTestStep> TemplateTestSteps { get; set; }
    }
}
