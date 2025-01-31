namespace TestScriptTracker.Models.OTP
{
    public class UpdatePasswordRequest
    {

        public string UserName { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
