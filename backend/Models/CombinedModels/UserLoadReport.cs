namespace TestScriptTracker.Models.CombinedModels
{
    public class UserLoadReport
    {
        public Guid UserID { get; set; }
        public string UserName { get; set; }
        public int NumberOfTeams { get; set; }
        public List<string> TeamNames { get; set; } // Include team names
        public int NumberOfActiveProjects { get; set; }
        public List<string> ProjectNames { get; set; } // Include project names
        public int NumberOfTestScripts { get; set; }
    }
}
