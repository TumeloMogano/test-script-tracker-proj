namespace TestScriptTracker.Models.DTO
{
    public class ProjectPhaseReturnDto
    {
        public Guid ProjectId { get; set; }

        public bool IsReadyForPhaseChange { get; set; } = false;

    }
}
