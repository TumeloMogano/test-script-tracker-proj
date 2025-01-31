using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using TestScriptTracker.Repositories.Interface;

namespace TestScriptTracker.Models.Domain
{
    [Table("Tags")]
    public class Tag : ISoftDelete
    {
        [Key]
        public Guid TagId { get; set; }
        [MaxLength(50)]
        public string TagName { get; set; } = string.Empty;
        [MaxLength(150)]
        public string TagDescription { get; set; } = string.Empty;
        public bool IsDeleted { get; set; } = false;
        public int TagTypeId { get; set; }

        public TagType TagType { get; set; }
        [JsonIgnore]
        public List<TestScriptTags> TestScriptTags { get; set; }
    }
}
