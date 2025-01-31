using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Models.ViewModel
{
    public class TemplateViewModel
    {
        public string TemplateName { get; set; } = string.Empty;
        public string TemplateTest { get; set; } = string.Empty;
        public string TemplateDescription { get; set; } = string.Empty;
        //public DateTime TempCreateDate { get; set; }
        //public int TempStatusId { get; set; }
    }
}
