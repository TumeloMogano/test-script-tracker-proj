using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Security.Claims;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.DTO;
using TestScriptTracker.NotificationService;
using TestScriptTracker.Repositories.Implementation;
using TestScriptTracker.Repositories.Interface;

namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly IUserRepository _userRepository;
        private readonly UserManager<AppUser> _userManager;
        private readonly IAuditRepository _auditRepository;

        public NotificationsController(INotificationService notificationService, IUserRepository userRepository, UserManager<AppUser> userManager, IAuditRepository auditRepository)
        {
            _notificationService = notificationService;
            _userRepository = userRepository;
            _userManager = userManager;
            _auditRepository = auditRepository;
        }

        
        [HttpPost("send")]
        public async Task<IActionResult> SendNotification([FromBody] SendNotificationRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                var detailedErrors = string.Join(", ", errors);
                Console.WriteLine($"Validation errors: {detailedErrors}");
                return BadRequest(ModelState);
            }

            var user = await _userRepository.FindByIdAsync(request.Id);
            if (user == null)
            {
                return NotFound("User not found - send");
            }

            //get the user logged in so that the receiver can see who sent the notification 
            var senderId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var sender = await _userManager.FindByIdAsync(senderId);

            if (sender == null)
            {
                return Unauthorized("Sender not found.");
            }

            await _notificationService.SendNotificationAsync(request.Id, request.Title, request.Message, sender.UserFirstName, sender.UserSurname); //request.Id
            var auditLog = new AuditLog
            {
                ActionId = 1, // 1 for Create action
                UserId = user.Id, // The user who performed action
                TimeStamp = DateTime.UtcNow,
                TableName = "Notifications",
                NewValues = JsonConvert.SerializeObject(new { request.Title, request.Message }),
                PrimaryKey = Guid.NewGuid().ToString()
            };
            await _auditRepository.AddAuditLog(auditLog);

            return Ok();
        }

        [HttpGet("{Id}")]
        public async Task<IActionResult> GetNotifications(Guid Id)
        {
            var user = await _userRepository.FindByIdAsync(Id);
            if (user == null)
            {
                return NotFound("User not found-id");
            }

            var notifications = await _notificationService.GetNotificationsAsync(Id);

            return Ok(notifications);
        }

        [HttpGet("UserFirstName/{Id}")]
        public async Task<IActionResult> GetUserFirstName(Guid Id)
        {
            var user = await _userManager.FindByIdAsync(Id.ToString());
            if (user == null)
            {
                return NotFound("User not found-name");
            }
            return Ok(new { UserFirstName = user.UserFirstName });
        }

        [HttpGet("search/{userFirstName}")]
        public async Task<IActionResult> SearchUsersByUsername(string userFirstName)
        {
            var users = await _userRepository.SearchUsersByUsernameAsync(userFirstName);
            var result = users.Select(u => new { u.Id, u.UserFirstName, u.UserSurname });
            return Ok(result);
        }

        [HttpGet("searchNotifications/{query}")]
        public async Task<IActionResult> SearchNotifications(string query)
        {
            var notifications = await _notificationService.SearchNotificationsAsync(query);
            return Ok(notifications);
        }

        //this update is for administrator 
        //[HttpPut("update/{notificationId}")]
        //public async Task<IActionResult> UpdateNotification(int notificationId, [FromBody] UpdateNotificationRequest request)
        //{
        //    var updatedNotification = await _notificationService.UpdateNotificationAsync(notificationId, request.Title, request.Message);
        //    if (updatedNotification == null)
        //    {
        //        return NotFound("Notification not found");
        //    }

        //    return Ok(updatedNotification);
        //}

        //searching notifications according to the logged in user 
        [HttpGet("searchNotificationsByUser/{userId}/{query}")]
        public async Task<IActionResult> SearchNotificationsByUser(Guid userId, string query)
        {
            var notifications = await _notificationService.SearchNotificationsByUserAsync(userId, query);
            return Ok(notifications);
        }


        [HttpDelete("remove/{notificationId}")]
        public async Task<IActionResult> RemoveNotification(Guid notificationId)
        {
            var result = await _notificationService.RemoveNotificationAsync(notificationId);
            if (!result)
            {
                return NotFound("Notification not found");
            }

            return Ok();
        }

        //notification is opened or not 
        [HttpPut("markAsOpened/{notificationId}")]
        public async Task<IActionResult> MarkNotificationAsOpened(Guid notificationId)
        {
            var result = await _notificationService.MarkNotificationAsOpenedAsync(notificationId);
            if (!result)
            {
                return NotFound("Notification not found");
            }

            return Ok();
        }

    }
}
