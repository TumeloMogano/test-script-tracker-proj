using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TestScriptTracker.Repositories.Interface;

namespace TestScriptTracker.Models.Domain
{
    [Table("Teams")]
    public class Team : ISoftDelete
    {
        [Key]
        public Guid TeamId { get; set; }
        [MaxLength(150)]
        public string TeamName { get; set; } = string.Empty;
        [MaxLength(150)]
        public string TeamDescription { get; set; } = string.Empty;
        public DateTime CreationDate { get; set; }
        public bool IsDeleted { get; set; } = false;

        public List<Project>? Projects { get; set; }//(1:Team, m:Projects)       
        public List<TeamMembers> TeamMembers { get; set; }//Relationship (m:users, m:teams)

        
    }
}
