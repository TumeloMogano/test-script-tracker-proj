using System.ComponentModel.DataAnnotations;
using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Models.ViewModel
{
    public class UserViewModel
    {
        public string UserName { get; set; } = string.Empty;
        public string UserSurname { get; set; } = string.Empty;
        public string UserIDNumber { get; set; } = string.Empty;
        public string UserContactNumber { get; set; } = string.Empty;
        public string UserEmailAddress { get; set; } = string.Empty;
        public string LoginUserName { get; set; } = string.Empty;
        public string LoginPassword { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; } = DateTime.Now;
        public string RegistrationCode { get; set; } = string.Empty;
        public string TemplateCreation { get; set; } = string.Empty;

        [Required]
        public int RegStatusId { get; set; } //FK
    }
}
