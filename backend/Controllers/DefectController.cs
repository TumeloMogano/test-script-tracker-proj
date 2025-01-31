using Microsoft.AspNetCore.Components.Web.Virtualization;
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
using TestScriptTracker.Models.OTP;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DefectController : ControllerBase
    {
        private readonly IDefectRepository _dRepository;
        private readonly ITestScriptRepository _testScriptRepository;
        private readonly IEmailService _emailService;
        private readonly AppDbContext _dbContext;

        public DefectController(IDefectRepository dRepository, ITestScriptRepository tsRepository, IEmailService emailService, IClientRepository clientRepository, ITokenService tokenService, AppDbContext dbContext)
        {
            _dRepository = dRepository;
            _testScriptRepository = tsRepository;
            _emailService = emailService;
            _dbContext = dbContext;
        }

        //Log Defect

        [HttpPost]
        [Route("LogDefect")]

        public async Task<IActionResult> LogDefect(DefectViewModel defect)
        {
            try
            {
                var loggedDefect = new Defect
                {
                    DefectDescription = defect.DefectDescription,
                    DateLogged = DateTime.Now,
                    IsDeleted = false,
                    DefectStatusId = 4, //In Progress
                    TestScriptId = defect.TestScriptId,
                    UserEmailAddress = defect.UserEmailAddress //User Logged In
                };
                await _dRepository.LogDefectAsync(loggedDefect);

                return Ok(loggedDefect);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }

        }
        //List of all Defects in the system
        [HttpGet]
        [Route("GetAllDefects")]
        public async Task<IActionResult> GetAllDefects()
        {

            try
            {
                var defects = await _dRepository.GetsAllDefectsAsync();
                return Ok(defects);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }
        //List of all Defects belonging to a Test Script
        [HttpGet]
        [Route("GetDefects")]
        public async Task<IActionResult> GetDefects(Guid testScriptId)
        {
            //var testScriptObject = await _testScriptRepository.GetScriptAsync(testScriptId);
            //var tsId = testScriptObject.TestScriptId;

            try
            {
                var defects = await _dRepository.GetsDefectsAsync(testScriptId);
                return Ok(defects);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }
        //Search/View Defect
        [HttpGet]
        [Route("GetDefect/{defectId}")]
        public async Task<IActionResult> GetDefect(Guid defectId)
        {
            var defect = await _dRepository.GetDefectAsync(defectId);

            if (defect is null)
            {
                return NotFound();
            }
            var newdefect = new DefectViewModel
            {
                DefectDescription = defect.DefectDescription,
                DateLogged = defect.DateLogged,
                IsDeleted = defect.IsDeleted,
                TestScriptId = defect.TestScriptId,
                DefectStatus = _dRepository.GetDefectStatus(defect.DefectStatusId),
                TestScriptName = _dRepository.GetTestScript(defect.TestScriptId),
                UserEmailAddress = defect.UserEmailAddress,
                DefectImage = defect.DefectImage

            };
            return Ok(newdefect);
        }

        //Update Defect
        [HttpPut]
        [Route("UpdateDefect/{defectId}")]
        public async Task<IActionResult> UpdateDefect(Guid defectId, [FromBody] string defectUpdate)
        {
            try
            {
                var defect = await _dRepository.GetDefectAsync(defectId);
                if (defect == null)
                {
                    return NotFound("Defect not found");
                }

                defect.DefectDescription = defectUpdate;

                await _dRepository.UpdateDefectAsync(defect);

                return Ok(defect);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }
        //Remove Defect
        [HttpDelete]
        [Route("RemoveDefect")]
        public async Task<IActionResult> RemoveDefect(Guid defect)
        {
            try
            {
                var loggedDefect = await _dRepository.GetDefectAsync(defect);

                if (loggedDefect == null)
                {
                    return NotFound("Defect not found");
                }

                await _dRepository.RemoveDefectAsync(loggedDefect);

                return Ok(); // Return 200 OK status
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }

        //Search by defect status ?
        [HttpGet]
        [Route("GetDefectByStatus")]
        public async Task<IActionResult> GetDefectByStatus(int statusId)
        {
            var defect = await _dRepository.GetDefectByStatusIdAsync(statusId);

            if (defect is null)
            {
                return NotFound();
            }
            return Ok(defect);
        }

        //These cannot be updated --status of a defect is closed
        //Close Defect -- close to a remove here just updates the defect to closed
        [HttpPut]
        [Route("CloseDefect")]
        public async Task<IActionResult> CloseDefect(Guid defectId)
        {
            try
            {
                var defect = await _dRepository.GetDefectAsync(defectId);
                if (defect == null)
                {
                    return NotFound("Defect not found");
                }

                defect.DefectStatusId = 3; //Closed

                await _dRepository.ResolveDefectAsync(defect);

                return Ok(defect);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }
        //Resolve Defect
        [HttpPut]
        [Route("ResolveDefect")]
        public async Task<IActionResult> ResolveDefect(Guid defectId)
        {
            try
            {
                var defect = await _dRepository.GetDefectAsync(defectId);
                if (defect == null)
                {
                    return NotFound("Defect not found");
                }

                defect.DefectStatusId = 1; //Resolved

                await _dRepository.ResolveDefectAsync(defect);

                return Ok(defect);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }

        //Unresolve Defect
        [HttpPut]
        [Route("UnresolveDefect")]
        public async Task<IActionResult> UnresolveDefect(Guid defectId)
        {
            try
            {
                var defect = await _dRepository.GetDefectAsync(defectId);
                if (defect == null)
                {
                    return NotFound("Defect not found");
                }

                defect.DefectStatusId = 2; //Unresolved

                await _dRepository.ResolveDefectAsync(defect);

                return Ok(defect);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }

        [HttpPost]
        [Route("LogClientDefect")] // Plural to reflect handling multiple defects
        public async Task<IActionResult> LogClientDefect(DefectViewModel defect)
        {
            try
            {
                    var loggedDefect = new Defect
                    {
                        DefectDescription = defect.DefectDescription,
                        DateLogged = DateTime.Now,
                        IsDeleted = false,
                        DefectStatusId = 4, // In Progress
                        TestScriptId = defect.TestScriptId,
                        DefectImage = defect.DefectImage,
                        UserEmailAddress = defect.UserEmailAddress // User Logged In
                    };

                    // Log each defect
                    await _dRepository.LogDefectAsync(loggedDefect);


                return Ok(loggedDefect); // Return the list of logged defects
            }
            catch (Exception ex)
            {
                // Log the exception (optional)
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpPost]
        [Route("LogClientDefects")] // Plural to reflect handling multiple defects
        public async Task<IActionResult> LogClientDefects(List<DefectAddViewModel> defects)
        {
            //try
            //{
                var loggedDefects = new List<DefectAddDto>(); // List to store logged defects

                foreach (var defect in defects)
                {
                    var loggedDefect = new Defect
                    {
                        DefectDescription = defect.DefectDescription,
                        DateLogged = DateTime.Now,
                        IsDeleted = false,
                        DefectStatusId = 4, // In Progress
                        TestScriptId = defect.TestScriptId,
                        DefectImage = defect.DefectImage,
                        UserEmailAddress = defect.UserEmailAddress // User Logged In
                    };

                    // Log each defect
                    var newdefect = await _dRepository.LogDefectAsync(loggedDefect);

                    var newAddedDefect = await _dRepository.GetDefectAsync(newdefect.DefectId);


                    var addedDefect = new DefectAddDto
                    {   
                        DefectDescription = newAddedDefect.DefectDescription,
                        DateLogged = newAddedDefect.DateLogged,
                        DefectStatusId = newAddedDefect.DefectStatusId,
                        TestScriptId = newAddedDefect.TestScriptId,
                        DefectImage = newAddedDefect.DefectImage,
                        UserEmailAddress = newAddedDefect.UserEmailAddress // User Logged In
                    };
                    // Add logged defect to the list to return
                    loggedDefects.Add(addedDefect);
                }

                return Ok(loggedDefects); // Return the list of logged defects
            //}
            //catch (Exception ex)
            //{
            //    // Log the exception (optional)
            //    return StatusCode(500, "Internal Server Error. Please Contact Support");
            //}
        }


        [HttpGet]
        [Route("GetDefectsForClient")]
        public async Task<IActionResult> GetDefectsForClients(Guid testScriptId)
        {
            try
            {
                var defects = await _dRepository.GetsDefectsAsync(testScriptId);

                var output = new List<DefectAddDto>();
                foreach (var defect in defects)
                {
                    if (defect.DefectStatusId == 4 )
                    {
                        var returnDefect = new DefectAddDto
                        {
                            DefectDescription = defect.DefectDescription,
                            DateLogged = defect.DateLogged,
                            DefectStatusId = defect.DefectStatusId,
                            TestScriptId = defect.TestScriptId,
                            DefectImage = defect.DefectImage,
                            UserEmailAddress = defect.UserEmailAddress // User Logged In
                        };
                        // Add logged defect to the list to return
                        output.Add(returnDefect);

                    }
                }

                return Ok(output);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

    }
}
