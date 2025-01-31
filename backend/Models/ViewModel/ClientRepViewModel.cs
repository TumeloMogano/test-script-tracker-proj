namespace TestScriptTracker.Models.ViewModel
{
    public class ClientRepViewModel
    {
        public string RepName { get; set; } = string.Empty;
        public string RepSurname { get; set; } = string.Empty;
        public string RepIDNumber { get; set; } = string.Empty;
        public string RepContactNumber { get; set; } = string.Empty;
        public string RepEmailAddress { get; set; } = string.Empty;
        public Guid ClientId { get; set; }//FK
        //public int UserId { get; set; }//FK
        
    }
}
