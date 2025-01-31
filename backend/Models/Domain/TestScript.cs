using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TestScriptTracker.Models.Domain
{
    [Table("TestScripts")]
    public class TestScript
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

        public Project Project { get; set; }
        public StatusType StatusType { get; set; }       
        public Template Template { get; set; }
        [JsonIgnore]
        public List<TestScriptTags> TestScriptTags { get; set; }

        [JsonIgnore]
        public List<Defect>? Defects { get; set; }
        public List<TestStep> TestSteps { get; set; }

        [JsonIgnore]
        public List<Comment>? Comments { get; set; }

        [JsonIgnore]
        public List<TestScriptAssignment> TestScriptAssignment { get; set; }

    }
}
