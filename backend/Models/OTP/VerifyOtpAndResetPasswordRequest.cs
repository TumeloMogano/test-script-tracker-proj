namespace TestScriptTracker.Models.OTP
{
    public class VerifyOtpAndResetPasswordRequest
    {

        public string UserEmailAddress { get; set; }
       // public string PasswordHash { get; set; }
        public int OtpCode { get; set; }
        public string NewPassword { get; set; }
    }
}
