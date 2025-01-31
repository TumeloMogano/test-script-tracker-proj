using Microsoft.AspNetCore.Components.Web.Virtualization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.DTO;
using TestScriptTracker.Models.ViewModel;
using TestScriptTracker.Repositories.Implementation;
using TestScriptTracker.Repositories.Interface;
using TestScriptTracker.MailingService;
using TestScriptTracker.Models;
using MimeKit.Encodings;
using static Org.BouncyCastle.Crypto.Engines.SM2Engine;
using BCrypt.Net;
using Org.BouncyCastle.Crypto.Generators;
//Nosipho for the the passwords 
using ForgotPasswordRequest = TestScriptTracker.Models.DTO.ForgotPasswordRequest;
using TestScriptTracker.Models.OTP;

namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository userRepository;
        private readonly IEmailService _emailService;
        private readonly IClientRepository _clientRepository;
        private readonly ITokenService _tokenService;
        private readonly AppDbContext _dbContext;

        public UserController(IUserRepository userRepository, IEmailService emailService, IClientRepository clientRepository, ITokenService tokenService, AppDbContext dbContext)
        {
            this.userRepository = userRepository;
            _emailService = emailService;
            _clientRepository = clientRepository;
            _tokenService = tokenService;
            _dbContext = dbContext;
        }
        //Create a new User but to request a user's registration
        [HttpPost]
        [Route("RegistrationRequest")]
        public async Task<IActionResult> RegistrationR(UserViewModel model)
        {
            string placeholder = "null";
            try
            {
                var query = new User
                {
                    UserName = model.UserName,
                    UserSurname = model.UserSurname,
                    UserIDNumber = model.UserIDNumber,
                    UserContactNumber = model.UserContactNumber,
                    UserEmailAddress = model.UserEmailAddress,
                    LoginUserName = placeholder, //no values yet
                    LoginPassword = placeholder, //no values yet
                    RegistrationDate = DateTime.Now, //no values yet
                    RegistrationCode = placeholder, //no values yet
                    TemplateCreation = placeholder, //no values yet
                    RegStatusId = 1 //awaiting approval status
                };
                await userRepository.RegistrationRAsync(query);

                return Ok(query);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");

            }
        }

        ////Create a new User's username & password (real registration/ update username and password fields)
        [HttpPut]
        [Route("RegisterUser")]
        public async Task<IActionResult> RegisterUser(string usertype, string useremail, UserViewModel registeredUser)
        {
            if (string.IsNullOrEmpty(usertype) || string.IsNullOrEmpty(useremail) || registeredUser == null)
            {
                return BadRequest("Invalid input parameters");
            }

            string placeholder = "null";
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(registeredUser.LoginPassword);

            try
            {
                var existingUser = await userRepository.GetUserByEmailAsync(useremail);

            if (existingUser != null)
            {
                if (existingUser.RegStatusId == 2 && existingUser.RegistrationCode == registeredUser.RegistrationCode && usertype.ToLower() == "employee")
                {
                    existingUser.LoginUserName = registeredUser.LoginUserName; //change only these attributes
                    existingUser.LoginPassword = hashedPassword; //change only these attributes
                    existingUser.RegistrationDate = DateTime.Now; //change only these attributes
                    existingUser.RegistrationCode = registeredUser.RegistrationCode; //change only these attributes
                    existingUser.TemplateCreation = placeholder; // no template yet
                    existingUser.RegStatusId = 4; //registered status

                    await userRepository.RegisterUserAsync(existingUser);

                    return Ok(existingUser); 
                }
                else if (existingUser.RegStatusId == 3)
                {
                    return BadRequest("Registration request has been rejected");
                }
                else if (existingUser.RegStatusId == 1)
                {
                    return BadRequest("User has not yet been approved to register");
                }
                else if (existingUser.RegistrationCode != registeredUser.RegistrationCode)
                {
                    return BadRequest("Registration code is invalid");
                }
                else
                {
                    return BadRequest("Try again");
                }
            }
            else if (usertype.ToLower() == "client")
            {
                // Find client rep here to fetch client data and create a new User
                var clientreps = await _clientRepository.GetAllClientRepsAsync();
                var foundRep = clientreps.FirstOrDefault(rep => rep.RepEmailAddress == useremail);

                if (foundRep == null)
                {
                    return NotFound("Client representative not found");
                }

                var clientUser = new User
                {
                    UserName = foundRep.RepName,
                    UserSurname = foundRep.RepSurname,
                    UserIDNumber = foundRep.RepIDNumber,
                    UserContactNumber = foundRep.RepContactNumber,
                    UserEmailAddress = foundRep.RepEmailAddress,
                    LoginUserName = registeredUser.LoginUserName,
                    LoginPassword = hashedPassword,
                    RegistrationDate = DateTime.Now,
                    RegistrationCode = placeholder,
                    TemplateCreation = placeholder,
                    RegStatusId = 4
                };

                // Now UserId must go to Client table
                foundRep.UserId = clientUser.UserId;

                await userRepository.RegisterUserAsync(clientUser);
                await _clientRepository.UpdateClientRepAsync(foundRep);

                return Ok(clientUser); 
            }
            else
            {
                return NotFound("You cannot register");
            }
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        //List of all Users
        [HttpGet]
        [Route("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {

            try
            {
                //Retrieve list from repository
                var users = await userRepository.GetAllUsersAsync();

                //Map domain model to dto using list retrieved from the repository
                var response = new List<UserDto>();
                foreach (var user in users)
                {
                    response.Add(new UserDto
                    {
                        UserId = user.UserId,
                        UserName = user.UserName,
                        UserSurname = user.UserSurname,
                        UserIDNumber = user.UserIDNumber,
                        UserContactNumber = user.UserContactNumber,
                        UserEmailAddress = user.UserEmailAddress,
                        LoginUserName = user.LoginUserName,
                        LoginPassword = user.LoginPassword,
                        RegistrationDate = user.RegistrationDate,
                        RegistrationCode = user.RegistrationCode,
                        TemplateCreation = user.TemplateCreation,
                        RegStatusId = user.RegStatusId,
                        RegistrationStatusName = user.RegistrationStatus.RegStatusName // Including the registration status name

                    });
                }

                return Ok(response);

            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please Contact Support");

            }

        }
        //List of all Registration requests to approve registration requests
        [HttpGet]
        [Route("GetRequests")]
        public async Task<IActionResult> GetRequests()
        {

            try
            {
                //Retrieve list from repository
                var users = await userRepository.GetRequestsAsync();
                return Ok(users);

            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please Contact Support");

            }

        }
        //Approve requests
        [HttpPut]
        [Route("ApproveRequests")]
        public async Task<IActionResult> ApproveRequests(Guid userid)
        {
            string placeholder = "null";
            var GeneratedCode = await userRepository.GenerateCodeAsync();
            try
            {
                var existingUser = await userRepository.GetUserByIdAsync(userid);

                if (existingUser == null)
                {
                    return NotFound("User not found");
                }

                existingUser.UserName = existingUser.UserName;
                existingUser.UserSurname = existingUser.UserSurname;
                existingUser.UserIDNumber = existingUser.UserIDNumber;
                existingUser.UserContactNumber = existingUser.UserContactNumber;
                existingUser.UserEmailAddress = existingUser.UserEmailAddress;
                existingUser.LoginUserName = existingUser.LoginUserName;
                existingUser.LoginPassword = existingUser.LoginPassword;
                existingUser.RegistrationDate = existingUser.RegistrationDate;
                existingUser.RegistrationCode = GeneratedCode; //generate a random code
                existingUser.TemplateCreation = placeholder; //no template yet
                existingUser.RegStatusId = 2; //approved status

                await userRepository.ApproveRequestAsync(existingUser);
                //send email with RegCode
                MailRequest mailRequest = new MailRequest();
                mailRequest.ToEmail = existingUser.UserEmailAddress;
                mailRequest.Subject = "Welcome to the EU Test Script Tracking Application";
                mailRequest.Body = _emailService.GetEmailBody(existingUser.UserName, existingUser.UserSurname, GeneratedCode);
                await _emailService.SendEmailAsync(mailRequest);

                return Ok(existingUser);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }
        //Reject requests
        [HttpPut]
        [Route("RejectRequests")]
        public async Task<IActionResult> RejectRequests(Guid userid)
        {
            string placeholder = "null";
            try
            {
                var existingUser = await userRepository.GetUserByIdAsync(userid);

                if (existingUser == null)
                {
                    return NotFound("User not found");
                }

                existingUser.UserName = existingUser.UserName;
                existingUser.UserSurname = existingUser.UserSurname;
                existingUser.UserIDNumber = existingUser.UserIDNumber;
                existingUser.UserContactNumber = existingUser.UserContactNumber;
                existingUser.UserEmailAddress = existingUser.UserEmailAddress;
                existingUser.LoginUserName = existingUser.LoginUserName;
                existingUser.LoginPassword = existingUser.LoginPassword;
                existingUser.RegistrationDate = existingUser.RegistrationDate;
                existingUser.RegistrationCode = placeholder; //generate a random code
                existingUser.TemplateCreation = placeholder; //no template yet
                existingUser.RegStatusId = 3; //rejected status

                await userRepository.ApproveRequestAsync(existingUser);
                //send email with RegCode
                MailRequest mailRequest = new MailRequest();
                mailRequest.ToEmail = existingUser.UserEmailAddress;
                mailRequest.Subject = "EU Test Script Tracking Application: Registration Rejected";
                mailRequest.Body = _emailService.GetRejectContent(existingUser.UserName, existingUser.UserSurname);
                await _emailService.SendEmailAsync(mailRequest);

                return Ok(existingUser);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }

        //Search User 
        [HttpGet]
        [Route("GetUserById/{userid}")]
        public async Task<IActionResult> GetUserById(Guid userid)
        {

            var existingUser = await userRepository.GetUserByIdAsync(userid);

            if (existingUser is null)
            {
                return NotFound();
            }

            var response = new UserViewModel
            {
                UserName = existingUser.UserName,
                UserSurname = existingUser.UserSurname,
                UserIDNumber = existingUser.UserIDNumber,
                UserContactNumber = existingUser.UserContactNumber,
                UserEmailAddress = existingUser.UserEmailAddress,
                LoginUserName = existingUser.LoginUserName,
                LoginPassword = existingUser.LoginPassword,
                RegistrationDate = existingUser.RegistrationDate,
                RegistrationCode = existingUser.RegistrationCode,
                TemplateCreation = existingUser.TemplateCreation,
                RegStatusId = existingUser.RegStatusId
            };

            return Ok(response);

        }
        //Update User details
        [HttpPut]
        [Route("UpdateUser/{userid}")]
        public async Task<IActionResult> UpdateUser(Guid userid, UserViewModel updatedUser)
        {
            try
            {
                var existingUser = await userRepository.GetUserByIdAsync(userid);

                if (existingUser == null)
                {
                    return NotFound("User not found");
                }

                existingUser.UserName = updatedUser.UserName;
                existingUser.UserSurname = updatedUser.UserSurname;
                existingUser.UserIDNumber = updatedUser.UserIDNumber;
                existingUser.UserContactNumber = updatedUser.UserContactNumber;
                existingUser.UserEmailAddress = updatedUser.UserEmailAddress;
                existingUser.LoginUserName = updatedUser.LoginUserName;
                existingUser.LoginPassword = existingUser.LoginPassword; //No updates to the attributes
                existingUser.RegistrationDate = existingUser.RegistrationDate; //No updates to the attributes
                existingUser.RegistrationCode = existingUser.RegistrationCode; //No updates to the attributes
                existingUser.TemplateCreation = existingUser.TemplateCreation; //No updates to the attributes
                existingUser.RegStatusId = existingUser.RegStatusId; //No updates to the attributes

                await userRepository.UpdateUserAsync(existingUser);

                return Ok(existingUser);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }
       

        //Delete / Remove User
        [HttpDelete]
        [Route("RemoveUser/{userid}")]
        public async Task<IActionResult> RemoveUser(Guid userid)
        {
            try
            {
                var existingUser = await userRepository.GetUserByIdAsync(userid);

                if (existingUser == null)
                {
                    return NotFound("User not found");
                }

                await userRepository.RemoveUserAsync(existingUser);

                return Ok(); // Return 200 OK status
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }
       

        //Nosipho
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto model)
        {

            try
            {
                //check loginuser details 
                var user = await userRepository.FindByUsernameAsync(model.LoginUserName);
                if (user == null)
                    return Unauthorized("Invalid username or password");

                //Hashing password
                if (!BCrypt.Net.BCrypt.Verify(model.LoginPassword, user.LoginPassword))
                    return Unauthorized("Invalid username or password");

                return Ok(new UserDto
                {
                    Message = "Logged in successfully",
                    UserName = user.LoginUserName,
                    LoginPassword = user.LoginPassword
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing your request.");
            }

        }



        //Forgot password end point 
        [HttpPost]
        [Route("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                //check if the email address on the database 
                var user = await userRepository.FirstEmailAsync(request.UserEmailAddress);
                if (user == null)
                {
                    return BadRequest("Email address not found");
                }

                //this will specifically be a five digit number
                Random random = new Random();
                int resetCode = random.Next(10000, 99999);

                user.ResetCode = resetCode;
                user.ResetCodeExpiration = DateTime.Now.AddMinutes(15); //will be avilable 15 mins
                await _dbContext.SaveChangesAsync();

                MailRequest mailRequest = new MailRequest
                {
                    ToEmail = request.UserEmailAddress,
                    Subject = "Welcome to theEU Test Scipt Tracking Application",
                    Body = _emailService.GetForgotPasswordEmailBody(resetCode)
                };

                await _emailService.SendEmailAsync(mailRequest);

                return Ok(new { Message = "OTP code has been sent to your email address" });
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("VerifyOtpAndResetPassword")]
        public async Task<IActionResult> VerifyOtpAndResetPassword([FromBody] VerifyOtpAndResetPasswordRequest request) //int otpCode) //string userEmailAddress, int otpCode, string newPassword)
        {
            try
            {
                //check that the email exists 
                var user = await userRepository.FirstEmailAsync(request.UserEmailAddress);
                if (user == null)
                {
                    return BadRequest("Email address not found.");
                }

                // Verify the OTP code and expiration time linked to the email
                if (user.ResetCode != request.OtpCode || user.ResetCodeExpiration < DateTime.Now)
                {
                    return BadRequest("Invalid or expired OTP code.");
                }

                //hash the new password and save it against this person 
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

                user.LoginPassword = hashedPassword;
                user.ResetCode = null;
                user.ResetCodeExpiration = null;
                await _dbContext.SaveChangesAsync();

                return Ok("Password has been reset successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred: " + ex.Message);
            }
        }


        //update password endpoint
        //[HttpPost("update-password")]
        //public async Task<IActionResult> UpdatePassword([FromBody] ResetPasswordDto request)
        //{
        //    //check their loin username 
        //    var user = await userRepository.GetUserByLoginUsernameAsync(request.LoginUsername);
        //    if (user == null)
        //    {
        //        return NotFound("User not found.");
        //    }


        //    //unhash the password on the database 

        //    string storedHashedPassword = user.LoginPassword;

        //    if (!BCrypt.Net.BCrypt.Verify(request.LoginPassword, storedHashedPassword))
        //    {
        //        return Unauthorized("Current password is invalid.");
        //    }


        //    // Hash the new password
        //    user.LoginPassword = BCrypt.Net.BCrypt.HashPassword(request.UpdatePassword);
        //    // user.LoginPassword = updatePassword;

        //    _dbContext.User.Update(user);
        //    await _dbContext.SaveChangesAsync();

        //    return Ok("Password has been updated successfully.");
        //}


        //Logout using a token
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _tokenService.InvalidateToken(token);
            return Ok(new { message = "Logout successful" });
        }


    }
}
