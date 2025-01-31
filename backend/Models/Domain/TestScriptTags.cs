using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("TestScriptTags")]
    public class TestScriptTags
    {
        [Key, Column(Order = 0)]
        public Guid TestScriptId { get; set; }
        public TestScript TestScript { get; set; }
        [Key, Column(Order = 1)]
        public Guid TagId { get; set; }
        public Tag Tag { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
