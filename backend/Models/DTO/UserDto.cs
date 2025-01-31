namespace TestScriptTracker.Models.DTO
{
    public class UserDto
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserSurname { get; set; } = string.Empty;
        public string UserIDNumber { get; set; } = string.Empty;
        public string UserContactNumber { get; set; } = string.Empty;
        public string UserEmailAddress { get; set; } = string.Empty;
        public string LoginUserName { get; set; } = string.Empty;
        public string LoginPassword { get; set; } = string.Empty;
        public DateTime? RegistrationDate { get; set; }
        public string? RegistrationCode { get; set; } = string.Empty;
        public string TemplateCreation { get; set; } = string.Empty;

        public int RegStatusId { get; set; } //FK
        public string RegistrationStatusName { get; set; } // Added property for the registration status name
                                                           //login in message 
        public string Message { get; set; }
    }
}
