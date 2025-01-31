namespace TestScriptTracker.Models.DTO
{
    public class TeamDto
    {
        public Guid TeamId { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public string TeamDescription { get; set; } = string.Empty;
        public DateTime CreationDate { get; set; }
    }
}
