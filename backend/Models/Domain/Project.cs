using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TestScriptTracker.Models.Domain
{
    [Table("Projects")]
    public class Project
    {
        [Key]
        public Guid ProjectId { get; set; }
        [MaxLength(50)]
        public string ProjectName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        [MaxLength(150)]
        public string ProjectDescription { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public bool SignedOff { get; set; } = false;
        public DateTime? SignedOffDate { get; set; }
        public string? Signature { get; set; }
        public string? ResponsibleClientRep { get; set; } 
        public bool IsDeleted { get; set; } = false;
        public Guid ClientId { get; set; }//Fk
        public Guid? TeamId { get; set; }//FK
        public int PhaseId { get; set; }//FK

        //Navigation Properties      
        public Client Client { get; set; }//(m:Projects, 1:Client)             
        public Team? Team { get; set; }//(m:Projects, 1:Team)
        [JsonIgnore]
        public Phase Phase { get; set; }//(m:Projects, 1:Phase)          
        public List<Notification>? Notifications { get; set; }//(1:Project, m:Notifications)       
        public List<TestScript>? TestScripts { get; set; }//(1: Project, m:TestScripts)
        public List<Status>? Statuses { get; set; } //(1: Project, m:Statuses)

    }
}
