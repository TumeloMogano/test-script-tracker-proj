using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("DownloadReportHistory")]
    public class DownloadReportHistory
    {
        [Key]
        public Guid DownloadRHistId { get; set; }
        [MaxLength(50)]
        public string DownloadRName { get; set; } = string.Empty;
        public DateTime DateGenerated { get; set; }
        public bool IsDeleted { get; set; } = false;
        public Guid? UserId { get; set; }

        public AppUser? User { get; set; }
    }
}
