using System.ComponentModel.DataAnnotations;


namespace TestScriptTracker.Models.DTO
{
    public class ProjectDto
    {
        public Guid ProjectId { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string ProjectDescription { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool SignedOff { get; set; }
        public DateTime? SignedOffDate { get; set; }
        public string? Signature { get; set; } = string.Empty;
        public string? ResponsibleClientRep { get; set; } = string.Empty;
        public Guid ClientId { get; set; }//Fk

        public Guid? TeamId { get; set; }//FK

        public int PhaseId { get; set; }//FK
        public string? PhaseName { get; set; } = string.Empty;
    }
}
