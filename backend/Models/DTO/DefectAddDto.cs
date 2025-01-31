namespace TestScriptTracker.Models.DTO
{
    public class DefectAddDto
    {
        public Guid DefectId { get; set; }
        public string DefectDescription { get; set; } = string.Empty;
        public Guid? TestScriptId { get; set; }
        public string UserEmailAddress { get; set; } = string.Empty;
        public string? DefectImage { get; set; }
        public DateTime DateLogged { get; set; }
        public int? DefectStatusId { get; set; }
    }
}
