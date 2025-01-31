using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [Table("Comments")]
    public class Comment
    {
        [Key]
        public Guid CommentId { get; set; }
        [MaxLength(50)]
        public string CommentTitle { get; set; }
        [MaxLength(500)]
        public string CommentLine { get; set; }
        public DateTime CommentDate { get; set; }
        public bool IsDeleted { get; set; } = false;
        public bool IsModified { get; set; } = false;
        public DateTime DateModified { get; set; }

        public Guid TestScriptId { get; set; }
        public TestScript TestScript { get; set; }

        public string UserEmail { get; set; }
        /*
        public Guid UserId { get; set; }
        public User User { get; set; }
        */
    }
}
