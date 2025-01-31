namespace TestScriptTracker.Models.DTO
{
    public class UpdatePassword
    {
        public string UserEmailAddress { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
