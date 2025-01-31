namespace TestScriptTracker.Models.CombinedModels
{
    public class TestScriptReport
    {
        public Guid ProjectID { get; set; }
        public string ProjectName { get; set; }
        public Guid? TeamID { get; set; }
        public string TeamName { get; set; }
        public Guid UserID { get; set; }
        public string UserName { get; set; }
        public List<TestScriptDetails> TestScripts { get; set; }
    }
}
