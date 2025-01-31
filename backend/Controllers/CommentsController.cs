using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Security.Claims;
using TestScriptTracker.Data;
using TestScriptTracker.MailingService;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.ViewModel;
using TestScriptTracker.NotificationService;
using TestScriptTracker.Repositories.Interface;


namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentRepository _commentRepository;
        private readonly UserManager<AppUser> _userManager;
        private readonly IEmailService _emailService;
        private readonly INotificationService _notificationService;
        private readonly AppDbContext _context;

        public CommentsController(ICommentRepository commentRepository, UserManager<AppUser> userManager, IEmailService emailService, INotificationService notificationService, AppDbContext context)
        {
            _commentRepository = commentRepository;
            _userManager = userManager;
            _emailService = emailService;
            _notificationService = notificationService;
            _context = context;
        }


        [HttpPost]
        [Route("CreateComment")]
        public async Task<IActionResult> AddComment(CommentViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else
            {
                try
                {
                    var comment = new Comment
                    {
                        CommentTitle = model.CommentTitle,
                        CommentLine = model.CommentLine,
                        CommentDate = DateTime.Now,
                        TestScriptId = model.TestScriptId,
                        UserEmail = model.UserEmail,
                    };

                    await _commentRepository.CreateComment(comment);

                    // Log the mentions data
                    Console.WriteLine($"Mentions data: {JsonConvert.SerializeObject(model.Mentions)}");

                    if (model.Mentions != null && model.Mentions.Any())
                    {
                        foreach (var mention in model.Mentions)
                        {
                            try
                            {
                                // Assign the newly created comment ID to each mention
                                mention.CommentId = comment.CommentId.ToString();

                                // Get the sender's details
                                var senderId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                                var user = await _userManager.FindByIdAsync(senderId);

                                if (user == null)
                                {
                                    Console.WriteLine("Sender not found.");
                                    return Unauthorized("Sender not found.");
                                }

                                // Send notification using the correct parameters
                                await _notificationService.SendNotificationAsync(
                                    mention.UserId,                  // UserId of the recipient
                                    model.NotificationTitle,         // Notification title
                                    model.Message,                   // Notification message
                                    user.UserFirstName,              // Sender's first name
                                    user.UserSurname                 // Sender's surname
                                );
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"Error processing mention: {ex.Message}");
                                // Optionally log more details
                            }
                        }
                    }


                    return Ok(comment);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error in NotifyMention: {ex.Message}");
                    Console.WriteLine(ex.StackTrace);
                    return StatusCode(500, "Internal Server Error. Please contact support if the problem persists.");
                }   
            }
        }



        [HttpPost("NotifyMention")]
        public async Task<IActionResult> NotifyMention([FromBody] List<CommentMentionVM> commentMentions)
        {
            try
            {
             
                foreach (var mention in commentMentions)
                {
                    string guidAsString = mention.UserId.ToString();
                    var user = await _userManager.FindByIdAsync(guidAsString);
                    //if (user != null)
                    //{
                    //    // Compose the notification details
                    //    var notificationTitle = "You've been mentioned in a comment!";
                    //    var notificationMessage = $"You were mentioned in a comment: {mention.Comment}";

                    //    // Send an in-app notification
                    //    await _notificationService.SendNotificationAsync(
                    //        user.Id,
                    //        notificationTitle,
                    //        notificationMessage,
                    //        user.UserFirstName,
                    //        user.UserSurname
                    //        );
                    //}
                }

                // Return a JSON response indicating success
                return Ok(new { message = "Mention notifications sent successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in NotifyMention: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                return StatusCode(500, "Internal Server Error. Please contact support if the problem persists.");
            }
        }





        [HttpGet]
        [Route("GetComments")]
        public async Task<IActionResult> GetAllComments()
        {
            try
            {
                var results = await _commentRepository.GetAllCommentsAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support if the problem persists.");
            }
        }

        [HttpGet("GetCommentById/{id}")]
        public async Task<IActionResult> GetTagCommentId(Guid id)
        {
            try
            {
                var comment = await _commentRepository.GetCommentByIdAsync(id);
                if (comment == null)
                {
                    return NotFound();
                }


                return Ok(comment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error retrieving comment. Please contact support if the problem persists.");
            }
        }

        [HttpPut("UpdateComment/{id}")]
        public async Task<IActionResult> UpdateComment(Guid id, [FromBody] CommentViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var comment = await _commentRepository.GetCommentByIdAsync(id);
                if (comment == null)
                {
                    return NotFound();
                }

                comment.CommentTitle = model.CommentTitle;
                comment.CommentLine = model.CommentLine;
                comment.IsModified = true;
                comment.DateModified = DateTime.Now;

                var updatedComment = await _commentRepository.UpdateCommentAsync(comment);

                if (model.Mentions != null && model.Mentions.Any())
                {
                    foreach (var mention in model.Mentions)
                    {
                        try
                        {
                            mention.CommentId = updatedComment.CommentId.ToString();

                            var senderId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                            var user = await _userManager.FindByIdAsync(senderId);

                            if (user == null)
                            {
                                return Unauthorized("Sender not found.");
                            }

                            // Send notification using the correct parameters
                            await _notificationService.SendNotificationAsync(
                                mention.UserId,                  
                                model.NotificationTitle,        
                                model.Message,              
                                user.UserFirstName,             
                                user.UserSurname                 
                            );
                        }
                        catch (Exception ex)
                        {
                            // Handle mention processing error
                            Console.WriteLine($"Error processing mention: {ex.Message}");
                            // Optionally log more details
                        }
                    }
                }

                return Ok(updatedComment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error updating comment. Please contact support if the problem persists.");
            }
        }




        [HttpDelete]
        [Route("DeleteComment/{id}")]
        public async Task<IActionResult> DeleteComment(Guid id)
        {
            try
            {
                var comment = await _commentRepository.GetCommentByIdAsync(id);

                if (comment == null)
                    return NotFound();

                /*
                var uEmail = _userManager.GetUserName(User);
                if (uEmail != comment.UserEmail)
                {
                    return BadRequest("You do not have permission to modify this comment");
                }*/

                await _commentRepository.DeleteCommentAsync(id);

                return Ok(comment);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support if the problem persists.");
            }
        }
    }
}
