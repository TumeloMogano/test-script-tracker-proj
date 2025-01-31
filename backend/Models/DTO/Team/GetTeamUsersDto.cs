using System.ComponentModel.DataAnnotations;

namespace TestScriptTracker.Models.DTO.Team
{
    public class GetTeamUsersDto
    {
        public Guid UserId { get; set; }
        public string UserFirstName { get; set; } = string.Empty;
        public string UserSurname { get; set; } = string.Empty;
        public string UserContactNumber { get; set; } = string.Empty;
        public string UserEmailAddress { get; set; } = string.Empty;
    }
}
