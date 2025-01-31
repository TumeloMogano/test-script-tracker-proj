using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TestScriptTracker.Models.DTO;
using System.Security.Cryptography;
using System.Text;
using TestScriptTracker.Data;
using TestScriptTracker.MailingService;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.ViewModel;
using TestScriptTracker.Repositories.Implementation;
using TestScriptTracker.Repositories.Interface;
using TestScriptTracker.Models.OTP;
using System.Text.Json;
using TestScriptTracker.Models.DTO.Team;
using Microsoft.EntityFrameworkCore;
using SkiaSharp;

namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUserClaimsPrincipalFactory<AppUser> _userClaimsPrincipalFactory;
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        private readonly IEmailService _emailService;
        private readonly IClientRepository _clientRepository;
        private readonly ITokenService _tokenService;
        private readonly AppDbContext _dbContext;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenRepository tokenRepository;
        private readonly ILogger<AuthenticationController> logger;
        private readonly ITemplateRepository _templateRepository;


        public AuthenticationController(UserManager<AppUser> userManager, IUserClaimsPrincipalFactory<AppUser> userClaimsPrincipalFactory,
            IConfiguration configuration, IUserRepository userRepository, IEmailService emailService, IClientRepository clientRepository,
            ITokenService tokenService, AppDbContext dbContext, SignInManager<AppUser> signInManager, ITokenRepository tokenRepository,
            ILogger<AuthenticationController> logger, ITemplateRepository templateRepository)
        {
            _userManager = userManager;
            _userClaimsPrincipalFactory = userClaimsPrincipalFactory;
            _configuration = configuration;
            _userRepository = userRepository;
            _emailService = emailService;
            _clientRepository = clientRepository;
            _tokenService = tokenService;
            _dbContext = dbContext;
            _signInManager = signInManager;
            this.tokenRepository = tokenRepository;
            this.logger = logger;
            _templateRepository = templateRepository;
        }

        //Create a new User but to request a user's registration (identity)
        [HttpPost]
        [Route("RegistrationRequest")]
        public async Task<IActionResult> RegistrationRR(AuthenticationViewModel model)
        {

            //string placeholder = "null";
            try
            {
                string normalizedEmail = _userManager.NormalizeEmail(model.UserEmailAddress);
                var testUser = await _userRepository.GetUsersByEmailAsync(model.UserEmailAddress);
                if (testUser == null)
                {

                    var query = new AppUser
                    {
                        UserFirstName = model.UserFirstName,
                        UserSurname = model.UserSurname,
                        UserIDNumber = model.UserIDNumber,
                        UserContactNumber = model.UserContactNumber,
                        UserEmailAddress = model.UserEmailAddress,
                        NormalizedEmail = normalizedEmail,
                        UserName = model.UserEmailAddress,
                        Email = model.UserEmailAddress,
                        PasswordHash = null,
                        RegistrationDate = null, //no values yet
                        RegistrationCode = null, //no values yet
                                                        //TemplateCreation = placeholder, //no values yet
                        IsNewPassword = false,
                        //TemplateCreation = placeholder, //no values yet
                        SecurityStamp = Guid.NewGuid().ToString(),
                        ConcurrencyStamp = Guid.NewGuid().ToString(),
                        RegStatusId = 1 //awaiting approval status
                    };
                    await _userRepository.RegistrationRRAsync(query);

                    return Ok(query);
                }
                else
                {
                    return BadRequest("Your email address is already used.");
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");

            }
        }

        //Create a new User's username & password (real registration/ update username and password fields)
        [HttpPut]
        [Route("RegisterUser")]
        public async Task<IActionResult> RegisterUsers(string usertype, string useremail, AuthenticationViewModel registeredUser)
        {
            if (string.IsNullOrEmpty(usertype) || string.IsNullOrEmpty(useremail) || registeredUser == null)
            {
                return BadRequest("Invalid input parameters");
            }

            //string placeholder = "null";
            try
            {
                var existingUser = await _userRepository.GetUsersByEmailAsync(useremail);

                if (existingUser != null)
                {
                    if (existingUser.RegStatusId == 2 && existingUser.RegistrationCode == registeredUser.RegistrationCode && usertype.ToLower() == "employee")
                    {
                        existingUser.Email = existingUser.Email;
                        var passwordHasher = new PasswordHasher<AppUser>();
                        existingUser.PasswordHash = passwordHasher.HashPassword(existingUser, registeredUser.PasswordHash);
                        existingUser.RegistrationDate = DateTime.Now; //change only these attributes
                        existingUser.RegistrationCode = existingUser.RegistrationCode; //no change
                        //existingUser.TemplateCreation = placeholder; // no template yet
                        existingUser.IsNewPassword = false;
                        existingUser.RegStatusId = 4; //registered status

                        await _userRepository.RegisterUsersAsync(existingUser);
                        await _userManager.UpdateSecurityStampAsync(existingUser);

                        var addToRoleResult = await _userManager.AddToRoleAsync(existingUser, "CoreUser");

                        if (!addToRoleResult.Succeeded)
                        {
                            //if addign to role fails. log the error and return an error
                            return StatusCode(500, "Failed to add user to role.");
                        }

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
                else
                {
                    return NotFound("You cannot register");
                }
            }
            catch (Exception)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        //Register a client - no requests or approval needed (send email with dummy password)
        [HttpPost]
        [Route("RegisterClient")]
        public async Task<IActionResult> RegisterClients(string usertype, string useremail)
        {
            if (string.IsNullOrEmpty(usertype) || string.IsNullOrEmpty(useremail))
            {
                return BadRequest("Invalid input parameters");
            }
            //string placeholder = "null";
            try
            {
                var existingUser = await _userRepository.GetUsersByEmailAsync(useremail);
                if (existingUser != null)
                {
                    return BadRequest("User already exists.");
                }

                if (usertype.ToLower() != "client")
                {
                    return BadRequest("User is not a client.");
                }
                if (existingUser == null && usertype.ToLower() == "client")
                {


                    // Find client rep here to fetch client data and create a new User
                    var clientreps = await _clientRepository.GetAllClientRepsAsync();
                    var foundRep = clientreps.FirstOrDefault(rep => rep.RepEmailAddress == useremail);
                    var passwordHasher = new PasswordHasher<AppUser>();
                    //var generatedPass = await _userRepository.GenerateCodeAsync();
                    var generatedPass = GeneratePassword();

                    if (foundRep == null)
                    {
                        return NotFound("Client representative not found");
                    }

                    var clientUser = new AppUser
                    {
                        UserFirstName = foundRep.RepName,
                        UserSurname = foundRep.RepSurname,
                        UserIDNumber = foundRep.RepIDNumber,
                        UserContactNumber = foundRep.RepContactNumber,
                        UserEmailAddress = foundRep.RepEmailAddress,
                        NormalizedEmail = _userManager.NormalizeEmail(foundRep.RepEmailAddress),
                        Email = foundRep.RepEmailAddress,
                        UserName = foundRep.RepEmailAddress,
                        PasswordHash = null,
                        RegistrationDate = DateTime.Now,
                        RegistrationCode = null,
                        //TemplateCreation = placeholder,
                        IsNewPassword = true,
                        RegStatusId = 4
                    };
                    //declared this late because it needs an existing user object
                    clientUser.PasswordHash = passwordHasher.HashPassword(clientUser, generatedPass);
                    //clientUser.PasswordHashExpiration = DateTime.UtcNow.AddDays(7); //expiration date?

                    var newuser = await _userRepository.RegisterClientsRepAsync(clientUser);
                    await _userManager.UpdateSecurityStampAsync(newuser);


                    // Now UserId must go to Client table
                    foundRep.UserId = newuser.Id;
                    await _clientRepository.UpdateClientRepAsync(foundRep);
                    //send email with set Password
                    MailRequest mailRequest = new MailRequest();
                    mailRequest.ToEmail = newuser.UserEmailAddress;
                    mailRequest.Subject = "EPI-USE: Welcome to the EU Test Script Tracking Application";
                    mailRequest.Body = _emailService.RegisterClientEmail(newuser.UserFirstName, newuser.UserSurname, generatedPass);
                    await _emailService.SendEmailAsync(mailRequest);

                    //return Ok(newuser);
                    // Serialize the response with options to handle circular references
                    var options = new JsonSerializerOptions
                    {
                        ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve,
                        WriteIndented = true
                    };

                    var jsonResult = new JsonResult(newuser, options);

                    return jsonResult;

                }
                else
                {
                    return BadRequest("Try again.");
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error. Please Contact Support");

            }
        }
        //Client Default Password Generated
            public static string GeneratePassword(int length = 8)
            {
                const string upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                const string lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
                const string numberChars = "0123456789";
                const string specialChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

                string allChars = upperCaseChars + lowerCaseChars + numberChars + specialChars;

                Random random = new Random();
                StringBuilder password = new StringBuilder();

                // Ensure at least one of each character type
                password.Append(upperCaseChars[random.Next(upperCaseChars.Length)]);
                password.Append(lowerCaseChars[random.Next(lowerCaseChars.Length)]);
                password.Append(numberChars[random.Next(numberChars.Length)]);
                password.Append(specialChars[random.Next(specialChars.Length)]);

                // Add remaining characters randomly from allChars
                for (int i = password.Length; i < length; i++)
                {
                    password.Append(allChars[random.Next(allChars.Length)]);
                }

                // Shuffle the characters to make it more random
                return ShufflePassword(password.ToString());
            }

            private static string ShufflePassword(string password)
            {
                Random random = new Random();
                return new string(password.ToCharArray().OrderBy(s => random.Next()).ToArray());
            }
        

        //Clean up if its a given password...  -- Not used anymore
        //[HttpPost("CleanUpExpiredPasswordHashes")]
        //public async Task<IActionResult> CleanUpExpiredPasswordHashes()
        //{
        //    var users = _dbContext.Users.Where(u => u.PasswordHashExpiration.HasValue && u.PasswordHashExpiration.Value < DateTime.UtcNow).ToList();

        //    foreach (var user in users)
        //    {
        //        user.PasswordHash = "null";
        //        user.PasswordHashExpiration = null;
        //        await _userRepository.UpdateUsersAsync(user);
        //    }

        //    return Ok("Expired password removed.");
        //}

        //Check if ClientRep/ Employee
        //[HttpGet]
        //[Route("CheckUserType")]
        //public async Task<string> CheckUserType(Guid test)
        //{
        //    var userType = "";
        //    try
        //    {
        //        var testUser = await _userRepository.GetUsersByIdAsync(test);

        //        if (testUser.PasswordHashExpiration.HasValue)
        //        {
        //            userType = "client";
        //        }
        //        else
        //        {
        //            userType = "employee";
        //        }

        //        return userType;
        //    }
        //    catch
        //    {
        //        return "Please contact admin";
        //    }

        //}

        //List of all Users
        [HttpGet]
        [Route("GetsAllUsers")]
        public async Task<IActionResult> GetsAllUsers()
        {

            try
            {
                //Retrieve list from repository
                var users = await _userRepository.GetsAllUsersAsync();

                //Map domain model to dto using list retrieved from the repository
                var response = new List<AuthenticationViewModel>();
                foreach (var user in users)
                {
                    response.Add(new AuthenticationViewModel
                    {
                        UserFirstName = user.UserFirstName,
                        UserSurname = user.UserSurname,
                        UserIDNumber = user.UserIDNumber,
                        UserContactNumber = user.UserContactNumber,
                        UserEmailAddress = user.UserEmailAddress,
                        RegistrationDate = user.RegistrationDate,
                        RegistrationCode = user.RegistrationCode,
                        //TemplateCreation = user.TemplateCreation,
                        IsNewPassword = user.IsNewPassword,
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
        [Route("GetsRequests")]
        public async Task<IActionResult> GetsRequests()
        {

            try
            {
                //Retrieve list from repository
                var users = await _userRepository.GetsRequestsAsync();
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
        public async Task<IActionResult> ApproveRequests(string useremail)
        {
            //string placeholder = "null";
            var GeneratedCode = await _userRepository.GenerateCodeAsync();
            try
            {
                var existingUser = await _userRepository.GetUsersByEmailAsync(useremail);

                if (existingUser == null)
                {
                    return NotFound("User not found");
                }

                existingUser.UserFirstName = existingUser.UserFirstName;
                existingUser.UserSurname = existingUser.UserSurname;
                existingUser.UserIDNumber = existingUser.UserIDNumber;
                existingUser.UserContactNumber = existingUser.UserContactNumber;
                existingUser.UserEmailAddress = existingUser.UserEmailAddress;
                existingUser.Email = existingUser.Email;
                existingUser.PasswordHash = existingUser.PasswordHash;
                existingUser.RegistrationDate = existingUser.RegistrationDate;
                existingUser.RegistrationCode = GeneratedCode; //generate a random code
                //existingUser.TemplateCreation = placeholder; //no template yet
                existingUser.IsNewPassword = existingUser.IsNewPassword;
                existingUser.RegStatusId = 2; //approved status

                await _userRepository.ApproveRequestsAsync(existingUser);
                //send email with RegCode
                MailRequest mailRequest = new MailRequest();
                mailRequest.ToEmail = existingUser.UserEmailAddress;
                mailRequest.Subject = "EPI-USE: Welcome to the EU Test Script Tracking Application";
                mailRequest.Body = _emailService.GetEmailBody(existingUser.UserFirstName, existingUser.UserSurname, GeneratedCode);
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
        public async Task<IActionResult> RejectRequests(string useremail)
        {
            //string placeholder = "null";
            try
            {
                var existingUser = await _userRepository.GetUsersByEmailAsync(useremail);

                if (existingUser == null)
                {
                    return NotFound("User not found");
                }

                existingUser.UserFirstName = existingUser.UserFirstName;
                existingUser.UserSurname = existingUser.UserSurname;
                existingUser.UserIDNumber = existingUser.UserIDNumber;
                existingUser.UserContactNumber = existingUser.UserContactNumber;
                existingUser.UserEmailAddress = existingUser.UserEmailAddress;
                existingUser.RegistrationDate = existingUser.RegistrationDate;
                existingUser.RegistrationCode = null; 
                //existingUser.TemplateCreation = placeholder; //no template yet
                existingUser.IsNewPassword = existingUser.IsNewPassword;
                existingUser.RegStatusId = 3; //rejected status

                await _userRepository.ApproveRequestsAsync(existingUser);
                //send email with RegCode
                MailRequest mailRequest = new MailRequest();
                mailRequest.ToEmail = existingUser.UserEmailAddress;
                mailRequest.Subject = "EPI-USE: EU Test Script Tracking Application. Registration Rejected";
                mailRequest.Body = _emailService.GetRejectContent(existingUser.UserFirstName, existingUser.UserSurname);
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
        [Route("GetUsersByEmail")]
        public async Task<IActionResult> GetUsersByEmail(string email)
        {

            var existingUser = await _userRepository.GetUsersByEmailAsync(email);

            if (existingUser is null)
            {
                return NotFound();
            }
            return Ok(existingUser);
        }
        //Search User 
        [HttpGet]
        [Route("GetCRepByEmail")]
        public async Task<IActionResult> GetCRepByEmail(string email)
        {

            var existingUser = await _userRepository.GetCRepsByEmailAsync(email);

            if (existingUser is null)
            {
                return NotFound();
            }
            return Ok(existingUser);
        }
        //Search User by ID
        [HttpGet]
        [Route("GetUserById/{userid}")]
        public async Task<IActionResult> GetUserById(Guid userid)
        {

            var existingUser = await _userRepository.GetUsersByIdAsync(userid);

            if (existingUser is null)
            {
                return NotFound();
            }
            return Ok(existingUser);

        }

        //Update User details
        [HttpPut]
        [Route("UpdateUsers")]
        public async Task<IActionResult> UpdateUsers(string email, AuthenticationViewModel updatedUser)
        {
            try
            {
                var existingUser = await _userRepository.GetUsersByEmailAsync(email);
                string normalizedEmail = _userManager.NormalizeEmail(updatedUser.UserEmailAddress);

                if (existingUser == null)
                {
                    return NotFound("User not found");
                }

                existingUser.UserFirstName = updatedUser.UserFirstName;
                existingUser.UserSurname = updatedUser.UserSurname;
                existingUser.UserIDNumber = updatedUser.UserIDNumber;
                existingUser.UserContactNumber = updatedUser.UserContactNumber;
                existingUser.UserEmailAddress = updatedUser.UserEmailAddress;
                existingUser.Email = existingUser.UserEmailAddress;
                existingUser.NormalizedEmail = normalizedEmail;
                existingUser.RegistrationDate = existingUser.RegistrationDate; //No updates to the attributes
                existingUser.RegistrationCode = existingUser.RegistrationCode; //No updates to the attributes
                //existingUser.TemplateCreation = existingUser.TemplateCreation; //No updates to the attributes
                existingUser.IsNewPassword = existingUser.IsNewPassword;
                existingUser.RegStatusId = existingUser.RegStatusId; //No updates to the attributes

                await _userRepository.UpdateUsersAsync(existingUser);

                return Ok(existingUser);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }

        //Delete / Remove User (identity)
        [HttpDelete]
        [Route("RemoveUsers")]
        public async Task<IActionResult> RemoveUsers(string email)
        {
            try
            {
                var existingUser = await _userRepository.GetUsersByEmailAsync(email);

                if (existingUser == null)
                {
                    return NotFound("User not found");
                }

                await _userRepository.RemoveUsersAsync(existingUser);

                return Ok(); // Return 200 OK status
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }
        //Check If Client Password is new or not
        [HttpGet]
        [Route("CheckIfNewPassWord")]
        public async Task<IActionResult> CheckIfNewPassWord(string email)
        {

            var existingUser = await _userRepository.GetUsersByEmailAsync(email);

            if (existingUser is null)
            {
                return NotFound();
            }
             return  Ok(existingUser.IsNewPassword); 

            //if(existingUser.IsNewPassword == true)
            //{
            //    return Ok("Please update the given password.");
            //}
            //else
            //{
            //    return Ok("Client Rep user password has been updated already.");
            //}
        }

        [HttpPost("login")]
        public async Task<ActionResult<AppUser>> Login(AuthenticationViewModel model)
        {

            try
            {

                //check loginuser details 
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null)
                { return NotFound("User not found"); }
                //Uhashing password
                var unhashPW = new PasswordHasher<AppUser>();
                var ValidPW = unhashPW.VerifyHashedPassword(user, user.PasswordHash, model.PasswordHash);
                if (ValidPW == PasswordVerificationResult.Success)
                {
                    var userP = await _userClaimsPrincipalFactory.CreateAsync(user);
                    return await GenerateJWTToken(user); // stops code or breaks
                    //return Ok("Login successful.");

                }
                else
                {
                    return BadRequest("Invalid credentials.");
                }
            }

            catch (Exception)
            {
                return BadRequest("Internal Server Error. Please contact admin.");
            }
        }

        [HttpPost]
        [Route("Sign-In")]
        public async Task<IActionResult> Signin([FromBody] LoginRequestDto request)
        {
            logger.LogInformation("Signin attempt for email: {Email}", request.Email);

            //check email
            var identityUser = await _userManager.FindByEmailAsync(request.Email);

            if (identityUser is not null)
            {
                logger.LogInformation("User found for email: {Email}", request.Email);

                //Manually verify the password
                var passwordHasher = new PasswordHasher<AppUser>();
                var verificationResult = passwordHasher.VerifyHashedPassword(identityUser, identityUser.PasswordHash, request.Password);

                //check password

                if (verificationResult == PasswordVerificationResult.Success)
                {
                    logger.LogInformation("Password check succeeded for email: {Email}", request.Email);

                    //create a token and response
                    var jwtToken = await tokenRepository.CreateJwtToken(identityUser);

                    var response = new LoginResponseDto()
                    {
                        Email = request.Email,
                        AccessToken = jwtToken
                    };

                    return Ok(response);
                }
                else
                {
                    logger.LogWarning("Password check failed for email: {Email}", request.Email);
                }
            }
            else
            {
                logger.LogWarning("No user found for email: {Email}", request.Email);
            }

            ModelState.AddModelError("", "Email or Password Incorrect");

            return ValidationProblem(ModelState);
        }

        [HttpGet]
        [Route("GetUserDetails/{email}")]
        public async Task<IActionResult> GetUserDetails([FromRoute] string email)
        {
            try
            {
                var user = await _userRepository.GetUserDetailsAsync(email);

                if (user == null)
                {
                    return NotFound();
                }

                var response = new UserDetailsDto()
                {
                    Id = user.Id,
                    FirstName = user.UserFirstName,
                    Surname = user.UserSurname,
                    Email = user.Email,
                    IdNumber = user.UserIDNumber,
                    ContactNumber = user.UserContactNumber
                };

                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
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
                // var user = await _userRepository.FirstEmailAsync(request.UserEmailAddress);
                var user = await _userManager.FindByEmailAsync(request.UserEmailAddress);
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
                    Subject = "EPI-USE: Welcome to theEU Test Scipt Tracking Application",
                    Body = _emailService.GetForgotPasswordEmailBody(resetCode)
                };

                await _emailService.SendEmailAsync(mailRequest);

                return Ok(new { Message = "OTP code has been sent to your email address" });
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("An error occurred while saving the entity changes: " + ex.InnerException?.Message);
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

                var user = await _userManager.FindByEmailAsync(request.UserEmailAddress);
                if (user == null)
                {
                    return BadRequest("Email address not found.");
                }

                // Verify the OTP code and expiration time linked to the email
                if (user.ResetCode != request.OtpCode || user.ResetCodeExpiration < DateTime.Now)
                {
                    return BadRequest("Invalid or expired OTP code.");
                }

                var passwordHasher = new PasswordHasher<AppUser>();
                user.PasswordHash = passwordHasher.HashPassword(user, request.NewPassword);
                user.ResetCode = null;
                user.ResetCodeExpiration = null;
                await _dbContext.SaveChangesAsync();

                //  return Ok("Password has been reset successfully.");
                return Ok(new { message = "Password has been reset successfully." });

            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred: " + ex.Message);
            }
        }

        //update password endpoint
        [HttpPost("update-password")]
        public async Task<IActionResult> UpdatePassword([FromBody] ResetPasswordDto request)
        {
            //check their loin username 
            var user = await _userManager.FindByEmailAsync(request.UserEmailAddress);
            if (user == null)
            {
                return NotFound("User not found."); 
            }

            //checking current password: 
            var passwordCheck = await _userManager.CheckPasswordAsync(user, request.CurrentPassword);
           
            //hash password
            var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
            if (!result.Succeeded)
            {
               var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return BadRequest($"Password update failed: {errors}");
            }

            // await _dbContext.SaveChangesAsync();
            return Ok("Password has been updated successfully.");
        }

        [HttpPost("update-password-no-check")]
        public async Task<IActionResult> UpdatePasswordWithoutCheck([FromBody] ResetPasswordDto request)
        {
            // Fetch the user by email
            var user = await _userManager.FindByEmailAsync(request.UserEmailAddress);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            //checking current password: 
            var passwordCheck = await _userManager.CheckPasswordAsync(user, request.CurrentPassword);

            // hash and set new password, no checking is done here
            user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, request.NewPassword);

            //for client rep 
            user.IsNewPassword = false;

            // Update the user's password
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest("Failed to update password");
            }

            return Ok("Password has been updated successfully.");
        }

        [HttpPost("update-password-no-check-client")]
        public async Task<IActionResult> UpdatePasswordWithoutCheckForClient([FromBody] ResetPasswordClientDto request)
        {
            // Fetch the user by email
            var user = await _userManager.FindByEmailAsync(request.UserEmailAddress);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            //checking current password: 
            //var passwordCheck = await _userManager.CheckPasswordAsync(user, request.CurrentPassword);

            // hash and set new password, no checking is done here
            user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, request.NewPassword);

            //for client rep 
            user.IsNewPassword = false;

            // Update the user's password
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            { 
                return BadRequest("Failed to update password");
            }

            return Ok("Password has been updated successfully.");
        }


        [HttpGet]
        private async Task<ActionResult> GenerateJWTToken(AppUser user)
        {
            var role = await _userManager.GetRolesAsync(user);
            IdentityOptions _identityOptions = new IdentityOptions();
            // Create JWT Token
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserFirstName),

            };

            if (role.Count() > 0)
            {
                claims.Add(new Claim(_identityOptions.ClaimsIdentity.RoleClaimType, role.FirstOrDefault()));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Tokens:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["Tokens:Issuer"],
                _configuration["Tokens:Audience"],
                claims,
                signingCredentials: credentials,
                expires: DateTime.UtcNow.AddHours(3)
            );

            return Created("", new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                user = user.UserFirstName
            });
        }

        //Logout using a token
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _tokenService.InvalidateToken(token);
            return Ok(new { message = "Logout successful" });
        }

        //for mobile app- getting clientRep details 
        [HttpGet("GetClientRepByUserId/{userId}")]
        public IActionResult GetClientRepByUserId(Guid userId)
        {
            // Retrieve the client representative details based on UserId
            var clientRep = _dbContext.ClientRepresentatives
                .Where(cr => cr.UserId == userId && !cr.IsDeleted)
                .Select(cr => new
                {
                   // cr.ClientRepId,
                    cr.RepName,
                    cr.RepSurname,
                    cr.RepEmailAddress,
                    cr.RepIDNumber,
                    cr.RepContactNumber,
                    cr.ClientId,
                   ClientName= cr.Client.ClientName
                })
                .FirstOrDefault();

            if (clientRep == null)
            {
                return NotFound("Client Representative details not found for this user.");
            }

            return Ok(clientRep);
        }


        [HttpGet]
        [Route("GetAllRegistrationStatuses")]
        public async Task<IActionResult> GetAllRegistrationStatuses()
        {
            try
            {
                var registrationStatuses = await _templateRepository.GetAllRegStatusesAsync();

                var response = new List<RegistrationStatusDto>();
                foreach (var regStatus in registrationStatuses)
                {
                    response.Add(new RegistrationStatusDto
                    {
                        RegStatusId = regStatus.RegStatusId,
                        RegStatusName = regStatus.RegStatusName
                    });
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support. " + ex.Message);
            }
        }

    }
}
