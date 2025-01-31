using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TestScriptTracker.Models.Domain
{
    [Table("TestScriptAssignments")]
    public class TestScriptAssignment
    {
        [Key, Column(Order = 0)]
        public Guid TestScriptId { get; set; }

        [JsonIgnore]
        public TestScript TestScript { get; set; }
        [Key, Column(Order = 1)]
        public Guid TeamId { get; set; }
        [Key, Column(Order = 2)]
        public Guid UserId { get; set; }
        public TeamMembers TeamMembers { get; set; }
    }
}
