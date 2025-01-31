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
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using Azure;
using System.Text.Json.Serialization;
using System.Text.Json;
using TestScriptTracker.Models.CombinedModels;
using QuestPDF.Helpers;
using SkiaSharp;


namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestScriptController : ControllerBase
    {
        private readonly ITestScriptRepository _tsRepository;
        private readonly IEmailService _emailService;
        private readonly AppDbContext _dbContext;
        private readonly IProjectRepository _prRepository;
        private readonly IDefectRepository _dfRepository;
        private readonly IStatusRepository _stRepository;
        private readonly ITemplateRepository _templateRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly IClientRepository _clientRepository;
        private readonly IUserRepository _userRepository;

        public TestScriptController(ITestScriptRepository tsRepository, IEmailService emailService, IClientRepository clientRepository, ITokenService tokenService, AppDbContext dbContext, IProjectRepository projectRepository, IDefectRepository defectRepository, IStatusRepository stRepository, ITemplateRepository templateRepository, ITeamRepository teamRepository, IUserRepository userRepository)
        {
            _tsRepository = tsRepository;
            _emailService = emailService;
            _dbContext = dbContext;
            _prRepository = projectRepository;
            _dfRepository = defectRepository;
            _stRepository = stRepository;
            _templateRepository = templateRepository;
            _clientRepository = clientRepository;
            _teamRepository = teamRepository;
            _userRepository = userRepository;
        }




        //  Create New Test Script - needs to use a template
        [HttpPost]
        [Route("CreateTestScript")]
        public async Task<IActionResult> CreateTestScript(TestScriptViewModel newTs)
        {
            //string placeholder = "null";
            try
            {
                var testScript = new TestScript
                {
                    Process = newTs.Process,
                    Test = newTs.Test,
                    TestScriptDescription = newTs.TestScriptDescription,
                    DateReviewed = DateTime.Now,
                    Version = 1,
                    IsDeleted = false,
                    IsAssigned = false,
                    ProjectId = newTs.ProjectId,
                    StatusTypeId = 1, //Created
                    TemplateId = newTs.TemplateId
                };
                await _tsRepository.CreateTestScriptAsync(testScript);

                var testscriptoutput = new TestScriptViewModel
                {
                    TestScriptId = testScript.TestScriptId,
                    Process = testScript.Process,
                    Test = testScript.Test,
                    TestScriptDescription = testScript.TestScriptDescription,
                    DateReviewed = testScript.DateReviewed,
                    StatusTypeId = testScript.StatusTypeId,
                    Version = testScript.Version,
                    IsAssigned = testScript.IsAssigned,
                    IsDeleted = testScript.IsDeleted,
                    ProjectId = testScript.ProjectId,
                    TemplateId = testScript.TemplateId,
                    StatusNameDisplayed = _tsRepository.GetStatusType(testScript.StatusTypeId),
                };
                //Get all statuses with same project Id
                var statuses = _dbContext.Statuses.Where(s => s.ProjectId == testScript.ProjectId);
                foreach (var stat in statuses)
                {
                    //Test if statusType is found in Status
                    if (testScript.StatusTypeId == stat.StatusTypeId)
                    {
                        testscriptoutput.StatusNameDisplayed = stat.StatusName;
                    }

                }

                //TemplateSteps

                var existingTemplate = await _templateRepository.GetTemplateByIdAsync(testscriptoutput.TemplateId);

                var existingTTestSteps = await _templateRepository.GetTemplateTestSteps(testscriptoutput.TemplateId);

                //var templateDetails = new TestScript
                //{
                //    TestSteps = existingTTestSteps.ToList()
                //};
                
                foreach( var testStep in existingTTestSteps)
                {
                    var ts = new TestStep
                    {
                        TestStepDescription = testStep.TempTestStepDescription,
                        TestStepRole = testStep.TempTestStepRole,
                        TestStepName = testStep.TempTestStep,
                        TestData = testStep.TempTestStepData,
                        AdditionalInfo = testStep.TempAdditionalInfo,
                        ExpectedOutcome = "N/A",
                        IsDeleted = false,
                        StepResultId = null, //not tested yet
                        TestScriptId = testscriptoutput.TestScriptId //created from the test script page which will pass this ID?
                    };

                    await _tsRepository.CreateTestStepAsync(ts);
                }

            return Ok(testscriptoutput);
            }
            catch (Exception ex)
            {
                return BadRequest("Invalid transaction. "+ ex.Message );
            }
        }

        //[HttpPost]
        //[Route("CreateTestScripts")]
        //public async Task<IActionResult> CreateTestScripts(Guid templateId, Guid projectId, string process)
        //{
        //    //string placeholder = "null";
        //    try
        //    {
        //        var template = await _templateRepository.GetTemplateByIdAsync(templateId);


        //        var testScript = new TestScript
        //        {
        //            Process = process,
        //            Test = template.TemplateTest,
        //            TestScriptDescription = template.TemplateDescription,
        //            DateReviewed = DateTime.Now,
        //            Version = 1,
        //            IsDeleted = false,
        //            IsAssigned = false,
        //            ProjectId = projectId,
        //            StatusTypeId = 1, //Created
        //            TemplateId = template.TemplateId,
        //        };
        //        var newTestScript = await _tsRepository.CreateTestScriptAsync(testScript);

        //        var TemptestSteps = await _templateRepository.GetTemplateTestSteps(templateId);



        //        foreach (var templateTestStep in TemptestSteps)
        //        {
        //            var ts = new TestStep
        //            {
        //                TestStepDescription = templateTestStep.TempTestStepDescription,
        //                TestStepRole = templateTestStep.TempTestStepRole,
        //                TestStepName = templateTestStep.TempTestStep,
        //                TestData = templateTestStep.TempTestStepData,
        //                AdditionalInfo = templateTestStep.TempAdditionalInfo,
        //                Feedback = "No data",
        //                IsDeleted = false,
        //                StepResultId = 1, //not tested yet
        //                TestScriptId = newTestScript.TestScriptId //created from the test script page which will pass this ID?
        //            };
        //            await _tsRepository.CreateTestStepAsync(ts);
        //        }


        //        var testscriptoutput = new TestScriptViewModel
        //        {
        //            TestScriptId = newTestScript.TestScriptId,
        //            Process = newTestScript.Process,
        //            Test = newTestScript.Test,
        //            TestScriptDescription = newTestScript.TestScriptDescription,
        //            DateReviewed = newTestScript.DateReviewed,
        //            StatusTypeId = newTestScript.StatusTypeId,
        //            Version = newTestScript.Version,
        //            IsAssigned = newTestScript.IsAssigned,
        //            IsDeleted = newTestScript.IsDeleted,
        //            ProjectId = newTestScript.ProjectId,
        //            TemplateId = newTestScript.TemplateId,
        //            StatusNameDisplayed = _tsRepository.GetStatusType(newTestScript.StatusTypeId),
        //            AssignedUser = "No one",
        //        };
        //        //Get all statuses with same project Id
        //        var statuses = _dbContext.Statuses.Where(s => s.ProjectId == newTestScript.ProjectId);
        //        foreach (var stat in statuses)
        //        {
        //            //Test if statusType is found in Status
        //            if (newTestScript.StatusTypeId == stat.StatusTypeId)
        //            {
        //                testscriptoutput.StatusNameDisplayed = stat.StatusName;
        //            }

        //        }

        //        //Get assigned user
               
        //        return Ok(testscriptoutput);
        //    }
        //    catch (Exception)
        //    {
        //        return BadRequest("Invalid transaction");
        //    }
        //}


        //List of Test Scripts in the system
        [HttpGet]
        [Route("GetAllScripts")]
        public async Task<IActionResult> GetAllScripts()
        {

            try
            {
                //Retrieve list from repository
                var testScripts = await _tsRepository.GetAllScriptsAsync();

                return Ok(testScripts);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }

        }

        //List of Step Results in the system
        [HttpGet]
        [Route("GetAllResults")]
        public async Task<IActionResult> GetAllResults()
        {

            try
            {
                //Retrieve list from repository
                var stepResults = await _tsRepository.GetAllResults();

                return Ok(stepResults);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }

        }
        //List of Test Scripts belonging to a project
        [HttpGet]
        [Route("GetProjectScripts")]
        public async Task<IActionResult> GetProjectScripts(Guid projectId)
        {

            try
            {
                //Retrieve list from repository
                var testScripts = await _tsRepository.GetScriptsAsync(projectId);
              
                return Ok(testScripts);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }

        }
        //List of Archived Test Scripts belonging to a project
        [HttpGet]
        [Route("GetArchivedProjectScripts")]
        public async Task<IActionResult> GetAProjectScripts(Guid projectId)
        {

            try
            {
                //Retrieve list from repository
                var testScripts = await _tsRepository.GetAScriptsAsync(projectId);

                return Ok(testScripts);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }

        }
        //Search/View Test Script
        [HttpGet]
        [Route("GetTestScript/{scriptId}")]
        public async Task<IActionResult> GetTestScript(Guid scriptId)
        {
            var testScript = await _tsRepository.GetScriptAsync(scriptId);

            if (testScript is null)
            {
                return NotFound();
            }
            var testscriptoutput = new TestScriptViewModel
            {
                TestScriptId = testScript.TestScriptId,
                Process = testScript.Process,
                Test = testScript.Test,
                TestScriptDescription = testScript.TestScriptDescription,
                DateReviewed = testScript.DateReviewed,
                StatusTypeId = testScript.StatusTypeId,
                Version = testScript.Version,
                IsAssigned = testScript.IsAssigned,
                IsDeleted = testScript.IsDeleted,
                ProjectId = testScript.ProjectId,
                TemplateId = testScript.TemplateId,
                StatusNameDisplayed = _tsRepository.GetStatusType(testScript.StatusTypeId),
            };
            //Get all statuses with same project Id
            var statuses = _dbContext.Statuses.Where(s => s.ProjectId == testScript.ProjectId);
            foreach (var stat in statuses)
            {
                //Test if statusType is found in Status
                if (testScript.StatusTypeId == stat.StatusTypeId)
                {
                    testscriptoutput.StatusNameDisplayed = stat.StatusName;
                }
               
            }
            return Ok(testscriptoutput);
        }
        //Search/View Test Script Assignment
        [HttpGet]
        [Route("GetTestScriptAssignment/{scriptId}")]
        public async Task<IActionResult> GetTestScriptAssignment(Guid scriptId)
        {
            var testScriptAssignment = await _tsRepository.GetAssignment(scriptId);

            if (testScriptAssignment is null)
            {
                return NotFound();
            }
           
            return Ok(testScriptAssignment);
        }

        //Archive Test Scripts -- just a IsDeleted change
        [HttpPut]
        [Route("ArchiveTestScript")]
        public async Task<IActionResult> ArchiveTestScript(Guid testScriptId)
        {
            try
            {
                var testScript = await _tsRepository.GetScriptAsync(testScriptId);
                if (testScript == null)
                {
                    return NotFound("Test Script not found");
                }

                testScript.IsDeleted = true;

                await _tsRepository.ArchiveScriptAsync(testScript);

                var testscriptoutput = new TestScriptViewModel
                {
                    TestScriptId = testScript.TestScriptId,
                    Process = testScript.Process,
                    Test = testScript.Test,
                    TestScriptDescription = testScript.TestScriptDescription,
                    DateReviewed = testScript.DateReviewed,
                    StatusTypeId = testScript.StatusTypeId,
                    Version = testScript.Version,
                    IsAssigned = testScript.IsAssigned,
                    IsDeleted = testScript.IsDeleted,
                    ProjectId = testScript.ProjectId,
                    TemplateId = testScript.TemplateId,
                    StatusNameDisplayed = _tsRepository.GetStatusType(testScript.StatusTypeId),

                };
                //Get all statuses with same project Id
                var statuses = _dbContext.Statuses.Where(s => s.ProjectId == testScript.ProjectId);
                foreach (var stat in statuses)
                {
                    //Test if statusType is found in Status
                    if (testScript.StatusTypeId == stat.StatusTypeId)
                    {
                        testscriptoutput.StatusNameDisplayed = stat.StatusName;
                    }
                   
                }
                return Ok(testscriptoutput);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }

        //Update Test Script
        [HttpPut]
        [Route("UpdateTestScript")]
        public async Task<IActionResult> UpdateTestScript(Guid testScriptId, TestScriptViewModel tsUpdate)
        {
            try
            {
                var testScript = await _tsRepository.GetScriptAsync(testScriptId);
                if (testScript == null)
                {
                    return NotFound("Test Script not found");
                }

                testScript.Process = tsUpdate.Process;
                testScript.Test = tsUpdate.Test;
                testScript.TestScriptDescription = tsUpdate.TestScriptDescription;
                testScript.DateReviewed = DateTime.Now;
                testScript.Version = testScript.Version;
                //changing of statuses will call this function
                testScript.StatusTypeId = tsUpdate.StatusTypeId;

                //update test steps is accounted for in its own endpoint
                await _tsRepository.UpdateScriptAsync(testScript);

                var testscriptoutput = new TestScriptViewModel
                {
                    TestScriptId = testScript.TestScriptId,
                    Process = testScript.Process,
                    Test = testScript.Test,
                    TestScriptDescription = testScript.TestScriptDescription,
                    DateReviewed = testScript.DateReviewed,
                    StatusTypeId = testScript.StatusTypeId,
                    Version = testScript.Version,
                    IsAssigned = testScript.IsAssigned,
                    IsDeleted = testScript.IsDeleted,
                    ProjectId = testScript.ProjectId,
                    TemplateId = testScript.TemplateId,
                    StatusNameDisplayed = _tsRepository.GetStatusType(testScript.StatusTypeId),

                };
                //Get all statuses with same project Id
                var statuses = _dbContext.Statuses.Where(s => s.ProjectId == testScript.ProjectId);
                foreach (var stat in statuses)
                {
                    //Test if statusType is found in Status
                    if (testScript.StatusTypeId == stat.StatusTypeId)
                    {
                        testscriptoutput.StatusNameDisplayed = stat.StatusName;
                    }
                   
                }
                return Ok(testscriptoutput);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }
        //Assign Test Script 
        [HttpPost]
        [Route("AssignTestScript")]
        public async Task<IActionResult> AssignTestScript(Guid userAssignId, Guid testScriptAssignId, Guid teamAssignedId)
        {
            try
            {
                var ts = await _tsRepository.GetScriptAsync(testScriptAssignId);
                if (ts == null) { return BadRequest("Test Script is null"); }
                // Check if the test script is already assigned
                if (ts.IsAssigned)
                {
                    return BadRequest("Test Script is already assigned");
                }

                ts.IsAssigned = true;
                await _tsRepository.UpdateScriptAsync(ts);

                var testScriptAssigned = new TestScriptAssignment
                {
                    TestScriptId = testScriptAssignId,
                    TeamId = teamAssignedId,
                    UserId = userAssignId
                };
                await _tsRepository.AssignTestScriptAsync(testScriptAssigned);
                //return Ok(testScriptAssigned);
                // Custom JSON serialization options
                var options = new JsonSerializerOptions
                {
                    ReferenceHandler = ReferenceHandler.Preserve,
                    WriteIndented = true // Optional: makes the JSON output more readable
                };

                // Serialize the response with the custom options
                var jsonResult = JsonSerializer.Serialize(testScriptAssigned, options);

                // Return the serialized JSON string
                return new OkObjectResult(jsonResult);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }

        }


        //Create Test Step
        [HttpPost]
        [Route("CreateTestStep/{testScriptID}")]
        public async Task<IActionResult> CreateTestStep(TestStepDto testStep, Guid testScriptID)
        {
            //string placeholder = "None";
            try
            {
                var ts = new TestStep
                {
                    TestStepDescription = testStep.TestStepDescription,
                    TestStepRole = testStep.TestStepRole,
                    TestStepName = testStep.TestStepName,
                    TestData = testStep.TestData,
                    AdditionalInfo = testStep.AdditionalInfo,
                    ExpectedOutcome = testStep.ExpectedOutcome,
                    Feedback = null,
                    IsDeleted = false,
                    StepResultId = null, //not tested yet
                    TestScriptId = testScriptID //created from the test script page which will pass this ID?
                };
                
                await _tsRepository.CreateTestStepAsync(ts);

                var newTs = new TestStepViewModel
                {
                    TestStepId = ts.TestStepId,
                    TestStepDescription = ts.TestStepDescription,
                    TestStepRole = ts.TestStepRole,
                    TestStepName = ts.TestStepName,
                    TestData = ts.TestData,
                    AdditionalInfo = ts.AdditionalInfo,
                    ExpectedOutcome = ts.ExpectedOutcome,
                    Feedback = ts.Feedback,
                    IsDeleted = ts.IsDeleted,
                    StepResultId = ts.StepResultId,
                    TestScriptId = ts.TestScriptId,
                    Result = null
                };
                return Ok(newTs);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }

        }

        //Get All Steps
        [HttpGet]
        [Route("GetAllSteps")]
        public async Task<IActionResult> GetAllSteps(Guid scriptId)
        {
            //string placeholder = "null";

            try
            {
                //Retrieve list from repository
                var testSteps = await _tsRepository.GetAllStepsAsync(scriptId);
              
                return Ok(testSteps);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }

        }
        //Get Test Step
        [HttpGet]
        [Route("GetTestStep/{stepId}")]
        public async Task<IActionResult> GetTestStep(Guid stepId)
        {
            //string placeholder = "null";

            var ts = await _tsRepository.GetStepAsync(stepId);

            if (ts is null)
            {
                return NotFound();
            }
            var newTs = new TestStepViewModel
            {
                TestStepId = ts.TestStepId,
                TestStepDescription = ts.TestStepDescription,
                TestStepRole = ts.TestStepRole,
                TestStepName = ts.TestStepName,
                TestData = ts.TestData,
                AdditionalInfo = ts.AdditionalInfo,
                ExpectedOutcome = ts.ExpectedOutcome,
                Feedback = ts.Feedback,
                IsDeleted = ts.IsDeleted,
                StepResultId = ts.StepResultId,
                TestScriptId = ts.TestScriptId,
                Result = _tsRepository.GetResult(ts.StepResultId)
            };
            return Ok(newTs);
        }

        //Update Test Step
        [HttpPut]
        [Route("UpdateTestStep")]
        public async Task<IActionResult> UpdateTestStep(Guid testStepId, TestStepViewModel tsUpdate)
        {
            try
            {
                var testStep = await _tsRepository.GetStepAsync(testStepId);
                if (testStep == null)
                {
                    return NotFound("Test Step not found");
                }

                testStep.TestStepDescription = tsUpdate.TestStepDescription;
                testStep.TestStepRole = tsUpdate.TestStepRole;
                testStep.TestStepName = tsUpdate.TestStepName;
                testStep.TestData = tsUpdate.TestData;
                testStep.AdditionalInfo = tsUpdate.AdditionalInfo;
                testStep.ExpectedOutcome = tsUpdate.ExpectedOutcome;
                testStep.Feedback = tsUpdate.Feedback;

                await _tsRepository.UpdateStepAsync(testStep);

                var newTs = new TestStepViewModel
                {
                    TestStepId = testStep.TestStepId,
                    TestStepDescription = testStep.TestStepDescription,
                    TestStepRole = testStep.TestStepRole,
                    TestStepName = testStep.TestStepName,
                    TestData = testStep.TestData,
                    AdditionalInfo = testStep.AdditionalInfo,
                    Feedback = testStep.Feedback,
                    ExpectedOutcome = testStep.ExpectedOutcome,
                    IsDeleted = testStep.IsDeleted,
                    StepResultId = testStep.StepResultId,
                    TestScriptId = testStep.TestScriptId,
                    //Result = _tsRepository.GetResult(testStep.StepResultId)
                };
                return Ok(newTs);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }
        //Step changes (used same for step result changes)
        [HttpPut]
        [Route("ChangeStepResult")]
        public async Task<IActionResult> ChangeStepResult(int stepResultId, Guid testStepId)
        {
            try
            {
                var testStep = await _tsRepository.GetStepAsync(testStepId);
                if (testStep == null)
                {
                    return NotFound("Test Step not found");
                }

                //change of step results here
                testStep.StepResultId = stepResultId;

                await _tsRepository.ChangeResultAsync(testStep);
                return Ok(testStep);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }
        //Remove Test Step
        [HttpDelete]
        [Route("RemoveTestStep")]
        public async Task<IActionResult> RemoveTestStep(Guid stepId)
        {
            try
            {
                var testStep = await _tsRepository.GetStepAsync(stepId);

                if (testStep == null)
                {
                    return NotFound("Test Step not found");
                }

                await _tsRepository.RemoveStepAsync(testStep);

                var newTs = new TestStepViewModel
                {
                    TestStepId = testStep.TestStepId,
                    TestStepDescription = testStep.TestStepDescription,
                    TestStepRole = testStep.TestStepRole,
                    TestStepName = testStep.TestStepName,
                    TestData = testStep.TestData,
                    AdditionalInfo = testStep.AdditionalInfo,
                    Feedback = testStep.Feedback,
                    ExpectedOutcome = testStep.ExpectedOutcome,
                    IsDeleted = true,
                    StepResultId = testStep.StepResultId,
                    TestScriptId = testStep.TestScriptId,
                    Result = _tsRepository.GetResult(testStep.StepResultId)
                };
                return Ok(newTs);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }


        ////Next phase checking and incrementing for Projects
        [HttpGet]
        [Route("CheckPhaseChangeReady")]
        public async Task<IActionResult> CheckPhaseChangeReady(Guid projectId)
        {
            try
            {
                var project = await _prRepository.GetProjectByIdAsync(projectId);
                if (project == null) return NotFound("Project not found");

                // Get all test scripts for the project
                var testScriptList = await _tsRepository.GetScriptsAsync(projectId);
                if (!testScriptList.Any()) return NotFound("No test scripts found");

                int proceed = 0;

                foreach (var testScript in testScriptList)
                {
                    // Find defects of each test script
                    var defects = await _dfRepository.GetsDefectsAsync(testScript.TestScriptId);


                    //    if (!defects.Any())
                    //    {
                    //        continue;
                    //    }
                    int AllResolved = 0;
                    // Check each defects' status
                    foreach (var defect in defects)
                    {
                        if (defect != null && defect.DefectStatusId == 1) // Defect is resolved
                        {
                            AllResolved++;
                        }
                    }

                    if ((AllResolved == defects.Count()) && (testScript.StatusTypeId == 5)) { proceed++; AllResolved = 0; }

                }

                // Check if all test scripts are resolved and proceed with phase increment
                if (proceed == testScriptList.Count())
                {
                    var isChange = new ProjectPhaseReturnDto
                    {
                        ProjectId = projectId,
                        IsReadyForPhaseChange = true,
                    };
                    return Ok(isChange);
                }
                else
                {

                    var isChange = new ProjectPhaseReturnDto
                    {
                        ProjectId = projectId,
                        IsReadyForPhaseChange = false,
                    };
                    return Ok(isChange);
                }
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred: " + ex.Message);
            }
        }


        ////Next phase checking and incrementing for Projects
        [HttpPut]
        [Route("InitiateChangePhase")]
        public async Task<IActionResult> ChangePhase(Guid projectId, ProjectPhaseReturnDto dto)
        {
            try
            {
                var project = await _prRepository.GetProjectByIdAsync(projectId);
                if (project == null) return NotFound("Project not found");

                // Check if all test scripts are resolved and proceed with phase increment
                if (dto.IsReadyForPhaseChange == true)
                {
                    // Check if the project isn't already in the final phase
                    if (project.PhaseId < 3)
                    {
                        project.PhaseId++;
                        await _tsRepository.SignOffAsync(project);

                        return Ok(project);
                    }
                    else
                    {
                        var isChange = new ProjectSignOffReturnDto
                        {
                            ProjectId = projectId,
                            IsReadyForSignOff = true,
                        };
                        return Ok(isChange);

                        //return BadRequest("Project is ready for Sign-Off.");
                    }
                }
                else
                {

                    return BadRequest("Cannot change project phase.");

                }
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred: " + ex.Message);
            }
        }



        ////Next phase checking and incrementing for Projects
        [HttpPut]
        [Route("ChangePhase")]
        public async Task<IActionResult> ChangePhase(Guid projectId)
        {
            try
            {
                var project = await _prRepository.GetProjectByIdAsync(projectId);
                if (project == null) return NotFound("Project not found");

                // Get all test scripts for the project
                var testScriptList = await _tsRepository.GetScriptsAsync(projectId);
                if (!testScriptList.Any()) return NotFound("No test scripts found");

                int proceed = 0;

                foreach (var testScript in testScriptList)
                {
                    //Archive each script
                    testScript.IsDeleted = true;
                    await _tsRepository.ArchiveScriptAsync(testScript );

                    // Find defects of each test script
                    var defects = await _dfRepository.GetsDefectsAsync(testScript.TestScriptId);


                    //    if (!defects.Any())
                    //    {
                    //        continue;
                    //    }
                    int AllResolved = 0;
                    // Check each defects' status
                    foreach (var defect in defects)
                    {
                        if (defect != null && defect.DefectStatusId == 1) // Defect is resolved
                        {
                            AllResolved++;
                        }
                    }

                    if ((AllResolved == defects.Count()) && (testScript.StatusTypeId == 5)) { proceed++; AllResolved = 0; }

                }

                // Check if all test scripts are resolved and proceed with phase increment
                if (proceed == testScriptList.Count())
                {
                    // Check if the project isn't already in the final phase
                    if (project.PhaseId < 3)
                    {
                        project.PhaseId++;
                        await _tsRepository.SignOffAsync(project);

                        return Ok();
                    }
                    else
                    {
                        return BadRequest("Project is ready for Sign-Off.");

                    }
                }
                else
                {

                    return BadRequest("Defects have not been resolved for all test scripts.");

                }
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred: " + ex.Message);
            }
        }


        //Sign-off by checking that the Project phase is completed and no defects or unresolved issues. This is stored in the Project table
        [HttpGet]
        [Route("CheckSignOffReady")]
        public async Task<IActionResult> CheckSignOffReady(Guid projectId)
        {
            try
            {
                var project = await _prRepository.GetProjectByIdAsync(projectId);
                if (project == null) return NotFound("Project not found");

                // Get all test scripts for the project
                var testScriptList = await _tsRepository.GetScriptsAsync(projectId);
                if (!testScriptList.Any()) return NotFound("No test scripts found");

                int proceed = 0;


                foreach (var testScript in testScriptList)
                {
                    // Find defects of each test script
                    var defects = await _dfRepository.GetsDefectsAsync(testScript.TestScriptId);

                    //if (!defects.Any())
                    //{
                    //    continue;
                    //}
                    int AllResolved = 0;
                    // Check each defects' status
                    if (defects.Any())
                    {
                        foreach (var defect in defects)
                        {
                            if (defect.DefectStatusId == 1) // Defect is resolved
                            {
                                AllResolved++;
                            }
                        }
                    }
                    if ((AllResolved == defects.Count()) && (testScript.StatusTypeId == 5)) { proceed++; AllResolved = 0; }
                }

                // Check if all test scripts are resolved and proceed with phase increment
                if (proceed == testScriptList.Count() && project.PhaseId == 3)
                {
                    var isChange = new ProjectSignOffReturnDto
                    {
                        ProjectId = projectId,
                        IsReadyForSignOff = true,
                    };
                    return Ok(isChange);
                }
                else
                {

                    var isChange = new ProjectSignOffReturnDto
                    {
                        ProjectId = projectId,
                        IsReadyForSignOff = false,
                    };
                    return Ok(isChange);
                }

            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }

        [HttpPut]
        [Route("InitiateSignOff")]
        public async Task<IActionResult> SignOff(Guid projectId, ProjectSignOffReturnDto dto)
        {
            try
            {
                var project = await _prRepository.GetProjectByIdAsync(projectId);
                if (project == null) return NotFound("Project not found");


                if (dto.IsReadyForSignOff == true)
                {
                    project.SignedOff = true;
                    project.SignedOffDate = DateTime.Now;
                    project.Signature = dto.Signature;
                    await _tsRepository.SignOffAsync(project);
                    return Ok(project);
                }
                else
                {
                    return BadRequest("Cannot sign-off project.");
                }


            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }


        //Client Rep Sign-Off PDF Email
        [HttpPut]
        [Route("SendSignOffEmail")]
        public async Task<IActionResult> SendSignOffEmail(Guid projectId, IFormFile pdfFile)
        {
            try
            {
                //var project = await _prRepository.GetProjectByIdAsync(projectId);
            //Client Email
            //string RepEmail = project.ResponsibleClientRep;
            //var RepDets = await _userRepository.GetUsersByEmailAsync(RepEmail);
            //string RepName = RepDets.UserFirstName + " " + RepDets.UserSurname;
            //string LeadEmail = " ";

            //Team Lead Email
            //if (project.TeamId != null)

            //{
                var project = await _prRepository.GetProjectByIdAsync(projectId);
                //Client Email
                string RepEmail = project.ResponsibleClientRep;
                var RepDets = await _userRepository.GetUsersByEmailAsync(RepEmail);
                string RepName = RepDets.UserFirstName + " " + RepDets.UserSurname;
                string LeadEmail = " ";

                //Team Lead Email
                if (project.TeamId != null)
                {
                    var TeamDets = await _teamRepository.GetTeamMembersAsync((Guid)project.TeamId);
                    var leadDets = TeamDets.Where(x => x.IsTeamLead == true);
                    var Lead = leadDets.SingleOrDefault();
                    LeadEmail = Lead.User.UserEmailAddress;
                }
                AttachmentMailRequest mailRequest = new AttachmentMailRequest();
                //PDF Blob

                if (pdfFile == null)
                {
                    return BadRequest("No pdf file found");
                }
                else
                {
                    mailRequest.Attachment = pdfFile;
                }
                //Send email
                mailRequest.ToEmail = RepEmail;
                mailRequest.CcEmail = LeadEmail;
                mailRequest.Subject = "EPI-USE: Project Sign-Off Confirmation";
                mailRequest.Body = _emailService.SignOffEmail(project.ProjectName, RepName, project.SignedOffDate);
                await _emailService.SendAttachmentEmailAsync(mailRequest);
                return Ok();
            }
            catch
            {
                return BadRequest("Internal Server Error");
            }

            //Send email
            //mailRequest.ToEmail = RepEmail;
            //mailRequest.CcEmail = LeadEmail;
            //mailRequest.Subject = "Project Sign-Off Confirmation";
            //mailRequest.Body = _emailService.SignOffEmail(project.ProjectName, RepName, project.SignedOffDate);
            //await _emailService.SendAttachmentEmailAsync(mailRequest);
            //return Ok();
            //}
            //catch
           // {
                //return BadRequest("Internal Server Error");
            //}

        }






        //Sign-off by checking that the Project phase is completed and no defects or unresolved issues. This is stored in the Project table
        [HttpPut]
        [Route("SignOff")]
        public async Task<IActionResult> SignOff(Guid projectId, string signature)
        {
            try
            {
                var project = await _prRepository.GetProjectByIdAsync(projectId);
                if (project == null) return NotFound("Project not found");

                // Get all test scripts for the project
                var testScriptList = await _tsRepository.GetScriptsAsync(projectId);
                if (!testScriptList.Any()) return NotFound("No test scripts found");

                int proceed = 0;


                foreach (var testScript in testScriptList)
                {
                    // Find defects of each test script
                    var defects = await _dfRepository.GetsDefectsAsync(testScript.TestScriptId);

                    //if (!defects.Any())
                    //{
                    //    continue;
                    //}
                    int AllResolved = 0;
                // Check each defects' status
                if (defects.Any())
                {
                    foreach (var defect in defects)
                    {
                        if (defect.DefectStatusId == 1) // Defect is resolved
                        {
                            AllResolved++;
                        }
                    }
                }
                    if ((AllResolved == defects.Count()) && (testScript.StatusTypeId == 5)) { proceed++;  AllResolved = 0; }
                }

                // Check if all test scripts are resolved and proceed with phase increment
                if (proceed == testScriptList.Count())
                {
                    // Check if the project is already in the final phase
                    if (project.PhaseId == 3)
                    {
                        project.SignedOff = true;
                        project.SignedOffDate = DateTime.Now;
                        project.Signature = signature;
                        await _tsRepository.SignOffAsync(project);
                        return Ok();
                    }
                    else
                    {
                        return BadRequest("Project is not ready for Sign-Off.");
                    }
                }
                else
                {
                    return BadRequest("Defects have not been resolved for all test scripts.");
                }

            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }

        [HttpGet]
        [Route("CheckDefectsResolvedReady")]
        public async Task<IActionResult> CheckDefectsResolvedReady(Guid testscriptId)
        {
            try
            {
                var ts = await _tsRepository.GetTestScriptByIdAsync(testscriptId);
                if (ts == null) return NotFound("Test Script not found");

                // Get all test scripts for the project
                //var testScriptList = await _tsRepository.GetScriptsAsync(projectId);
                //if (!testScriptList.Any()) return NotFound("No test scripts found");



                int proceed = 0;


                //foreach (var testScript in testScriptList)
                //{
                    // Find defects of each test script
                    var defects = await _dfRepository.GetsDefectsAsync(ts.TestScriptId);

                    //if (!defects.Any())
                    //{
                    //    continue;
                    //}
                    int AllResolved = 0;
                    // Check each defects' status
                    if (defects.Any())
                    {
                        foreach (var defect in defects)
                        {
                            if (defect.DefectStatusId == 1) // Defect is resolved
                            {
                                AllResolved++;
                            }
                        }
                    }
                    if ((AllResolved == defects.Count())) { AllResolved = 0; }
                //}

                // Check if all test scripts are resolved and proceed with phase increment
                if (AllResolved == 0)
                {
                    var isChange = new DefectsResolvedDto
                    {
                        TestScriptId = ts.TestScriptId,
                        IsZeroDefects = true,
                    };
                    return Ok(isChange);
                }
                else
                {

                    var isChange = new DefectsResolvedDto
                    {
                        TestScriptId = ts.TestScriptId,
                        IsZeroDefects = false,
                    };
                    return Ok(isChange);
                }

            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }


        //Get Test Step
        [HttpGet]
        [Route("GetStepResult/{resultId}")]
        public async Task<IActionResult> GetStepResult(int resultId)
        {

            var ts = await _dbContext.StepResults.SingleOrDefaultAsync(x => x.StepResultId == resultId);

            if (ts is null)
            {
                return NotFound();
            }
            return Ok(ts);
        }

        [HttpPut]
        [Route("EvaluateFeedback")]
        public async Task<IActionResult> EvaluateFeedback(Guid testScriptId)
        {
            try
            {
                var testScript = await _tsRepository.GetScriptAsync(testScriptId);
                if (testScript == null)
                {
                    return NotFound("Test Script not found");
                }

                testScript.DateReviewed = DateTime.Now;
                testScript.Version = testScript.Version+1;
                //changing of statuses will call this function
                testScript.StatusTypeId = 3; //Back to In Progress

                //update test steps is accounted for in its own endpoint
                await _tsRepository.UpdateScriptAsync(testScript);

                var testscriptoutput = new TestScriptViewModel
                {
                    TestScriptId = testScript.TestScriptId,
                    Process = testScript.Process,
                    Test = testScript.Test,
                    TestScriptDescription = testScript.TestScriptDescription,
                    DateReviewed = testScript.DateReviewed,
                    StatusTypeId = testScript.StatusTypeId,
                    Version = testScript.Version,
                    IsAssigned = testScript.IsAssigned,
                    IsDeleted = testScript.IsDeleted,
                    ProjectId = testScript.ProjectId,
                    TemplateId = testScript.TemplateId,
                    StatusNameDisplayed = _tsRepository.GetStatusType(testScript.StatusTypeId),

                };
                //Get all statuses with same project Id
                var statuses = _dbContext.Statuses.Where(s => s.ProjectId == testScript.ProjectId);
                foreach (var stat in statuses)
                {
                    //Test if statusType is found in Status
                    if (testScript.StatusTypeId == stat.StatusTypeId)
                    {
                        testscriptoutput.StatusNameDisplayed = stat.StatusName;
                    }

                }
                var steps = await _tsRepository.GetAllStepsAsync(testScriptId);
                foreach (var step in steps)
                {
                    step.StepResultId = null;
                    step.Feedback = null;
                    await _tsRepository.UpdateStepAsync(step);
                }

                var defects = await _dfRepository.GetsDefectsAsync(testScriptId);
                if (defects.Count() > 0)
                {
                    foreach (var defect in defects)
                    {
                        defect.DefectStatusId = 4;
                        await _dfRepository.UpdateDefectAsync(defect);
                    }
                }
                return Ok(testscriptoutput);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }

        //Unarchive TS
        [HttpPut]
        [Route("UnarchiveTestScript")]
        public async Task<IActionResult> UnarchiveTestScript(Guid testScriptId)
        {
            try
            {
                var testScript = await _tsRepository.GetScriptAsync(testScriptId);
                if (testScript == null)
                {
                    return NotFound("Test Script not found");
                }

                testScript.IsDeleted = false;

                await _tsRepository.ArchiveScriptAsync(testScript);

                var testscriptoutput = new TestScriptViewModel
                {
                    TestScriptId = testScript.TestScriptId,
                    Process = testScript.Process,
                    Test = testScript.Test,
                    TestScriptDescription = testScript.TestScriptDescription,
                    DateReviewed = testScript.DateReviewed,
                    StatusTypeId = testScript.StatusTypeId,
                    Version = testScript.Version,
                    IsAssigned = testScript.IsAssigned,
                    IsDeleted = testScript.IsDeleted,
                    ProjectId = testScript.ProjectId,
                    TemplateId = testScript.TemplateId,
                    StatusNameDisplayed = _tsRepository.GetStatusType(testScript.StatusTypeId),

                };
                //Get all statuses with same project Id
                var statuses = _dbContext.Statuses.Where(s => s.ProjectId == testScript.ProjectId);
                foreach (var stat in statuses)
                {
                    //Test if statusType is found in Status
                    if (testScript.StatusTypeId == stat.StatusTypeId)
                    {
                        testscriptoutput.StatusNameDisplayed = stat.StatusName;
                    }

                }
                return Ok(testscriptoutput);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }
        //Take back to Created
        [HttpPut]
        [Route("RecreateTestScript")]
        public async Task<IActionResult> RecreateTestScript(Guid testScriptId)
        {
            try
            {
                var testScript = await _tsRepository.GetScriptAsync(testScriptId);
                if (testScript == null)
                {
                    return NotFound("Test Script not found");
                }

                testScript.DateReviewed = DateTime.Now;
                testScript.Version = testScript.Version + 1;
                //changing of statuses will call this function
                testScript.StatusTypeId = 1; //Back to Created

                //update test steps is accounted for in its own endpoint
                await _tsRepository.UpdateScriptAsync(testScript);

                var testscriptoutput = new TestScriptViewModel
                {
                    TestScriptId = testScript.TestScriptId,
                    Process = testScript.Process,
                    Test = testScript.Test,
                    TestScriptDescription = testScript.TestScriptDescription,
                    DateReviewed = testScript.DateReviewed,
                    StatusTypeId = testScript.StatusTypeId,
                    Version = testScript.Version,
                    IsAssigned = testScript.IsAssigned,
                    IsDeleted = testScript.IsDeleted,
                    ProjectId = testScript.ProjectId,
                    TemplateId = testScript.TemplateId,
                    StatusNameDisplayed = _tsRepository.GetStatusType(testScript.StatusTypeId),

                };
                //Get all statuses with same project Id
                var statuses = _dbContext.Statuses.Where(s => s.ProjectId == testScript.ProjectId);
                foreach (var stat in statuses)
                {
                    //Test if statusType is found in Status
                    if (testScript.StatusTypeId == stat.StatusTypeId)
                    {
                        testscriptoutput.StatusNameDisplayed = stat.StatusName;
                    }

                }
                var steps = await _tsRepository.GetAllStepsAsync(testScriptId);
                foreach (var step in steps)
                {
                    step.StepResultId = null;
                    step.Feedback = null;
                    await _tsRepository.UpdateStepAsync(step);
                }

                var defects = await _dfRepository.GetsDefectsAsync(testScriptId);
                if (defects.Count() > 0)
                {
                    foreach (var defect in defects)
                    {
                        defect.DefectStatusId = 4;
                        await _dfRepository.UpdateDefectAsync(defect);
                    }
                }
                return Ok(testscriptoutput);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }
        //When Phase Changes, archive existing test scripts --- under ChangePhase

        //checked defects if resolved to submit
        [HttpGet]
        [Route("CheckToSubmit/{testScriptId}")]
        public async Task<IActionResult> CheckToSubmit(Guid testScriptId)
        {
            try
            {
                var testScript = await _tsRepository.GetScriptAsync(testScriptId);
                if (testScript == null)
                {
                    return NotFound("Test Script not found");
                }

                var defects = await _dfRepository.GetsDefectsAsync(testScriptId);
                int doSubmit = 0;
                if (defects.Count() > 0)
                {
                    foreach (var defect in defects)
                    {
                        if ((defect.DefectStatusId == 1) || (defect.DefectStatusId == 3))
                        {
                            doSubmit = doSubmit + 1;
                        }
                        else
                        {
                            doSubmit = doSubmit + 0;
                        }
                    }
                }
                if (doSubmit == defects.Count()) { return Ok(testScript); }
                else
                { return BadRequest("Not all defects are resolved."); }
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }

        //COPY THIS CODE TO RECEIVE NEW CHANGES
        [HttpGet]
        [Route("GetProjectTestScriptsToTest/{projectId}")]
        public async Task<IActionResult> GetProjectTestScriptsToTest(Guid projectId)
        {

            try
            {
                //Retrieve list from repository
                //var testScripts = await _tsRepository.GetScriptsToTestAsync(projectId, 2);

                var testScripts = await _tsRepository.GetScriptsToTestAsync(projectId);

                var output =new List<TestScriptDto>();
                foreach (var testScript in testScripts)
                {
                    if ((testScript.StatusType.StatusTypeName == "Submitted") ||
                        (testScript.StatusType.StatusTypeName == "Passed") ||
                        (testScript.StatusType.StatusTypeName == "Failed") ||
                        (testScript.StatusType.StatusTypeName == "Failed with Defects"))
                    {
                        output.Add(new TestScriptDto
                        {
                            TestScriptId = testScript.TestScriptId,
                            Process = testScript.Process,
                            Test = testScript.Test,
                            TestScriptDescription = testScript.TestScriptDescription,
                            DateReviewed = testScript.DateReviewed,
                            Version = testScript.Version,
                            IsDeleted = testScript.IsDeleted,
                            IsAssigned = testScript.IsAssigned,
                            ProjectId = projectId,
                            StatusTypeId = testScript.StatusTypeId,
                            TemplateId = testScript.TemplateId,
                            StatusTypeName = testScript.StatusType.StatusTypeName
                        });
                    }
                }

                return Ok(output);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }

        }

        [HttpGet]
        [Route("GetTestScriptByID/{scriptId}")]
        public async Task<IActionResult> GetTestScriptByID(Guid scriptId)
        {
            var testScript = await _tsRepository.GetTestScriptByIdAsync(scriptId);

            if (testScript is null)
            {
                return NotFound();
            }

            var testscriptoutput = new TestScriptDto
            {
                TestScriptId = testScript.TestScriptId,
                Process = testScript.Process,
                Test = testScript.Test,
                TestScriptDescription = testScript.TestScriptDescription,
                DateReviewed = testScript.DateReviewed,
                StatusTypeId = testScript.StatusTypeId,
                Version = testScript.Version,
                IsAssigned = testScript.IsAssigned,
                IsDeleted = testScript.IsDeleted,
                ProjectId = testScript.ProjectId,
                TemplateId = testScript.TemplateId,
                StatusTypeName = testScript.StatusType.StatusTypeName
            };

            return Ok(testscriptoutput);
        }

        [HttpGet]
        [Route("GetAllStepsWithResultName")]
        public async Task<IActionResult> GetAllStepsWithResultName(Guid scriptId)
        {
            try
            {
                //Retrieve list from repository
                var testSteps = await _tsRepository.GetAllStepswithResultNamesAsync(scriptId);

                var response = new List<TestStepResultDto>();
                foreach (var ts in testSteps)
                {
                    response.Add(new TestStepResultDto
                    {
                        TestScriptId = ts.TestScriptId,
                        TestStepDescription = ts.TestStepDescription,
                        TestData = ts.TestData,
                        TestStepId = ts.TestStepId,
                        TestStepName = ts.TestStepName,
                        TestStepRole = ts.TestStepRole,
                        StepResultId = ts.StepResultId,
                        StepResultName = ts.StepResult != null ? ts.StepResult.StepResultName : null, // Check if StepResult is null
                        AdditionalInfo = ts.AdditionalInfo,
                        Feedback = ts.Feedback,
                        ExpectedOutcome = ts.ExpectedOutcome,
                        IsDeleted = ts.IsDeleted
                    });
                }
                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpGet]
        [Route("GetAllStepResults")]
        public async Task<IActionResult> GetAllStepResults()
        {

            try
            {
                //Retrieve list from repository
                var stepResults = await _tsRepository.GetAllStepResultsAsync();

                return Ok(stepResults);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }

        }

        [HttpGet]
        [Route("GetAllStatusTypes")]
        public async Task<IActionResult> GetAllStatusTypes()
        {

            try
            {
                //Retrieve list from repository
                var statusTypes = await _tsRepository.GetAllStatusTypesAsync();

                return Ok(statusTypes);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpPut]
        [Route("UpdateTestStepsBatch")]
        public async Task<IActionResult> UpdateTestStepsBatch(Guid testScriptId, [FromBody] List<TestStepResultViewModel> testStepUpdates)
        {
            try
            {
                var allStepResults = await _tsRepository.GetAllStepResultsAsync();
                var allStatusTypes = await _tsRepository.GetAllStatusTypesAsync();

                // Initialize flags to track step results
                bool allPassed = true;
                bool allFailed = true;
                bool allFailedWithDefects = true;

                var outputBack = new List<TestStepResultViewModel>();

                foreach (var updateModel in testStepUpdates)
                {
                    if (updateModel.TestStepId == Guid.Empty)
                    {
                        return BadRequest("Invalid TestStepId");
                    }

                    if (updateModel.StepResultId <= 0)
                    {
                        return BadRequest("Invalid StepResultId");
                    }

                    // Fetch the test step
                    var testStep = await _tsRepository.GetStepAsync(updateModel.TestStepId);
                    if (testStep == null)
                    {
                        return NotFound($"Test Step with ID {updateModel.TestStepId} not found");
                    }


                    if (string.IsNullOrEmpty(updateModel.Feedback))
                    {
                        testStep.StepResultId = updateModel.StepResultId;
                        //testStep.Feedback = updateModel.Feedback;
                    }
                    else
                    {
                        testStep.StepResultId = updateModel.StepResultId;
                        testStep.Feedback = updateModel.Feedback;
                    }

                    // Save the changes for this test step
                    await _tsRepository.UpdateStepAsync(testStep);

                    // Track step result types for status determination
                    var stepResult = allStepResults.FirstOrDefault(sr => sr.StepResultId == updateModel.StepResultId)?.StepResultName;

                    if (stepResult != "Passed")
                    {
                        allPassed = false;
                    }

                    if (stepResult != "Failed")
                    {
                        allFailed = false;
                    }

                    if (stepResult != "Failed with Defects")
                    {
                        allFailedWithDefects = false;
                    }

                    var updatedTestStep = await _tsRepository.GetStepAsync(updateModel.TestStepId);

                    outputBack.Add(new TestStepResultViewModel
                    {
                        TestStepId = updatedTestStep.TestStepId,
                        StepResultId = updatedTestStep.StepResultId ?? 0,
                        Feedback = updatedTestStep.Feedback,

                    });
                }

                // Fetch the test script
                var testScript = await _tsRepository.GetScriptAsync(testScriptId);
                if (testScript == null)
                {
                    return NotFound($"Test Script with ID {testScriptId} not found");
                }

                // Update the statusType based on the step results
                if (allPassed)
                {
                    testScript.StatusTypeId = allStatusTypes.FirstOrDefault(st => st.StatusTypeName == "Passed")?.StatusTypeId ?? 0;
                }
                else if (allFailed)
                {
                    testScript.StatusTypeId = allStatusTypes.FirstOrDefault(st => st.StatusTypeName == "Failed")?.StatusTypeId ?? 0;
                }
                else if (allFailedWithDefects)
                {
                    testScript.StatusTypeId = allStatusTypes.FirstOrDefault(st => st.StatusTypeName == "Failed with Defects")?.StatusTypeId ?? 0;
                }
                else
                {
                    // If any step has "Failed", set the status to "Failed"
                    testScript.StatusTypeId = allStatusTypes.FirstOrDefault(st => st.StatusTypeName == "Failed")?.StatusTypeId ?? 0;
                }

                // Save the updated test script
                await _tsRepository.UpdateScriptAsync(testScript);

                return Ok(outputBack);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred: {ex.Message}");
            }
        }
    }
}
