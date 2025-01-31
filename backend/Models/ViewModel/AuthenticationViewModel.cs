using System.ComponentModel.DataAnnotations;

namespace TestScriptTracker.Models.ViewModel
{
    public class AuthenticationViewModel
    {
        [Required]
        //[StringLength(20, MinimumLength =3, ErrorMessage = "First name must be at least {2}, and maximum {1} character")]
        public string UserFirstName { get; set; } = string.Empty;
        [Required]
        public string UserSurname { get; set; } = string.Empty;
        [Required]
        public string UserIDNumber { get; set; } = string.Empty;
        [Required]
        public string UserContactNumber { get; set; } = string.Empty;
        [Required]
        public string UserEmailAddress { get; set; } = string.Empty;
        public DateTime? RegistrationDate { get; set; } = DateTime.Now;
        public string? RegistrationCode { get; set; } = string.Empty;
        //public string TemplateCreation { get; set; } = string.Empty;
        public bool? IsNewPassword { get; set; } = false;
       // [Required]
        public string Email { get; set; } = string.Empty;
        public string NormalizedEmail { get; set; } = string.Empty;
      //  [Required]
        public string? PasswordHash { get; set; } = string.Empty;


        public string? Password { get; set; } = string.Empty;

        [Required]
        public int RegStatusId { get; set; } //FK
        public string RegistrationStatusName { get; set; } = string.Empty;// Added property for the registration status name
    }
}
