using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TestScriptTracker.Models.Domain
{
    [Table("TemplateStatus")]
    public class TemplateStatus
    {
        [Key]
        public int TempStatusId { get; set; }
        [MaxLength(50)]
        public string TempStatusName { get; set; } = string.Empty;
        public List<Template>? Templates { get; set; }
    }
}
