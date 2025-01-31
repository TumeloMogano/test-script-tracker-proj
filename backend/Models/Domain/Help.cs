using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("Help")]
    public class Help
    {
        [Key]
        public int HelpId { get; set; }
        [MaxLength(50)]
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;

        public string ImageUrl { get; set; }
    }
}
