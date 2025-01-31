namespace TestScriptTracker.Models.DTO
{
    public class ProjectSignOffReturnDto
    {
        public Guid ProjectId { get; set; }

        public bool IsReadyForSignOff { get; set; } = false;

        public string? Signature { get; set; }

    }
}
