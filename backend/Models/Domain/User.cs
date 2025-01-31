using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestScriptTracker.Models.Domain
{
    [NotMapped]
    public class User
    {
        [Key]
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserSurname { get; set; } = string.Empty;
        public string UserIDNumber { get; set; } = string.Empty;
        public string UserContactNumber { get; set; } = string.Empty;
        public string UserEmailAddress { get; set; } = string.Empty;
        public string LoginUserName { get; set; } = string.Empty;
        public string LoginPassword { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; } 
        public string RegistrationCode { get; set; } = string.Empty;
        public string TemplateCreation { get; set; } = string.Empty;

        //ForeignKey //Navigation Properties

        //Relationship (0/m:Users, 1:RegStatus)
        public int RegStatusId { get; set; }

        [ForeignKey("RegStatusId")]
        public RegistrationStatus RegistrationStatus { get; set; }

        //Relationship (1:User, 0/1:ClientReps)
        public ClientRepresentative? ClientRepresentative { get; set; }//Nav prop

        //Forgot password:
        public int? ResetCode { get; set; }
        public DateTime? ResetCodeExpiration { get; set; }

    }
}
