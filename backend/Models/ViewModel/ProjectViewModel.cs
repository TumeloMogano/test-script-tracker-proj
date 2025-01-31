using System.ComponentModel.DataAnnotations;
using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Models.ViewModel
{
    public class ProjectViewModel
    {
        public string ProjectName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string ProjectDescription { get; set; } = string.Empty;
        //public bool IsActive { get; set; }

        //public bool SignedOff { get; set; }
        //public DateTime? SignedOffDate { get; set; }
        //public string? Signature { get; set; } = string.Empty;

        [Required]
        public Guid ClientId { get; set; }//Fk

        
        public Guid? TeamId { get; set; }//FK

        public string? ResponsibleClientRep { get; set; }


        //[Required]
        //public int PhaseId { get; set; }//FK
    }
}
