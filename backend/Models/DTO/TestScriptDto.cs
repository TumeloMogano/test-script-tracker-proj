using System.ComponentModel.DataAnnotations;

namespace TestScriptTracker.Models.DTO
{
    public class TestScriptDto
    {
        [Key]
        public Guid TestScriptId { get; set; }
        [MaxLength(30)]
        public string Process { get; set; } = string.Empty;
        [MaxLength(30)]
        public string Test { get; set; } = string.Empty;
        [MaxLength(150)]
        public string TestScriptDescription { get; set; } = string.Empty;
        public DateTime DateReviewed { get; set; }
        public int Version { get; set; }
        public bool IsDeleted { get; set; } = false;
        public bool IsAssigned { get; set; } = false;
        public Guid ProjectId { get; set; }
        public int StatusTypeId { get; set; }
        public Guid TemplateId { get; set; } = Guid.Empty;
        public string? StatusTypeName { get; set; } = string.Empty;

    }
}
