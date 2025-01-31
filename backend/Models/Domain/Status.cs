using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("Statuses")]
    public class Status
    {
        [Key]
        public Guid StatusId { get; set; }
        [MaxLength(50)]
        public string StatusName { get; set; } = string.Empty;
        [MaxLength(150)]
        public string StatusDescription { get; set; } = string.Empty;
        public bool IsDeleted { get; set; } = false;
        public Guid ProjectId { get; set; }
        public int StatusTypeId { get; set; }

        public Project Projects { get; set; }
        public StatusType StatusType { get; set; }
        //public List<TestScript> TestScripts { get; set; }
    }
}
