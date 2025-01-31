using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("Defects")]
    public class Defect
    {
        [Key]
        public Guid DefectId { get; set; }
        [MaxLength(255)]
        public string DefectDescription { get; set; } = string.Empty;
        public DateTime DateLogged { get; set; }
        public bool IsDeleted { get; set; } = false;
        public int? DefectStatusId { get; set; }
        public Guid? TestScriptId { get; set; }
        public string? UserEmailAddress { get; set; } = string.Empty;

        public string? DefectImage { get; set; }

        public DefectStatus DefectStatus { get; set; }        
        public TestScript TestScript { get; set; }
    }
}
