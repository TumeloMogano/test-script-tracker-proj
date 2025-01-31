using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("RegistrationStatus")]
    public class RegistrationStatus
    {
        [Key]
        public int RegStatusId { get; set; }
        [MaxLength(50)]
        public string RegStatusName { get; set; } = string.Empty;
        public List<AppUser>? Users { get; set; }//(1:RegStatus, 0/m:Users)
    }
}
