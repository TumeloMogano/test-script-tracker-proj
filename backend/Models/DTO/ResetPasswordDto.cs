namespace TestScriptTracker.Models.DTO
{
    public class ResetPasswordDto
    {

        public string UserEmailAddress { get; set; }

        public string CurrentPassword { get; set; }

        public string NewPassword { get; set; }

       // public string PasswordHash { get; set; }
    }
}
