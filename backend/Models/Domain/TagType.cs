using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TestScriptTracker.Models.Domain
{
    [Table("TagTypes")]
    public class TagType
    {
        [Key]
        public int TagTypeId { get; set; }
        [MaxLength(50)]
        public string TagtypeName { get; set; } = string.Empty;
        [JsonIgnore]
        public List<Tag> Tag { get; set; }
    }
}
