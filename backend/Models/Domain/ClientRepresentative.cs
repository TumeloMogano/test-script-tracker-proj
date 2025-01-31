using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("ClientRepresentatives")]
    public class ClientRepresentative
    {
        [Key]
        public Guid ClientRepId { get; set; }
        [MaxLength(30)]
        public string RepName { get; set; } = string.Empty;
        [MaxLength(30)]
        public string RepSurname { get; set; } = string.Empty;
        [MaxLength(13)]
        public string RepIDNumber { get; set; } = string.Empty;
        [MaxLength(10)]
        public string RepContactNumber { get; set; } = string.Empty;
        [MaxLength(50)]
        public string RepEmailAddress { get; set; } = string.Empty;
        public bool IsDeleted { get; set; } = false;
        public Guid ClientId { get; set; }//FK
        public Guid? UserId { get; set; }//FK

        public Client Client { get; set; }//(m:ClientReps, 1:Client)
        public AppUser? User { get; set; }//(0/1:ClientRep, 1:User)

    }
}
