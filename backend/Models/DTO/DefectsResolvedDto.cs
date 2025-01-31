namespace TestScriptTracker.Models.DTO
{
    public class DefectsResolvedDto
    {
        public Guid TestScriptId { get; set; }

        public bool IsZeroDefects { get; set; } = false;
    }
}
