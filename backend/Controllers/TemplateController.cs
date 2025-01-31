using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
//using System.Security.Cryptography.Xml;
using TestScriptTracker.Data;
using TestScriptTracker.Models.CombinedModels;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.DTO;
using TestScriptTracker.Models.ViewModel;
using TestScriptTracker.Repositories.Implementation;
using TestScriptTracker.Repositories.Interface;

namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TemplateController : ControllerBase
    {
        private readonly ITemplateRepository _templateRepository;

        public TemplateController(ITemplateRepository templateRepository)
        {
            _templateRepository = templateRepository;
        }

        [HttpPost]
        [Route("CreateTemplate")]
        public async Task<IActionResult> CreateTemplate(TemplateViewModel model)
        {
            try
            {
                var newTemplate = new Template
                {
                    TemplateName = model.TemplateName,
                    TemplateTest = model.TemplateTest,
                    TemplateDescription = model.TemplateDescription,
                    TempCreateDate = DateTime.Now,
                    IsDeleted = false,
                    TempStatusId = 1 //Draft template status
                };

                await _templateRepository.CreateTemplate(newTemplate);

                //var addedTemplate = new TemplateDto
                //{
                //    TemplateId = newTemplate.TemplateId,
                //    TemplateName = newTemplate.TemplateName,
                //    TemplateDescription = newTemplate.TemplateDescription,
                //    TemplateTest = newTemplate.TemplateTest,
                //    TempCreateDate = newTemplate.TempCreateDate,
                //    IsDeleted = newTemplate.IsDeleted,
                //    Feedback = newTemplate.Feedback,
                //    TempStatusId = newTemplate.TempStatusId,
                //    TemplateStatusName = newTemplate.TemplateStatus.TempStatusName
                //};

                return Ok(newTemplate);
                //return Ok("Project created successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support" + ex.Message);
            }
        }



        [HttpGet]
        [Route("GetTemplateById/{templateId}")]
        public async Task<IActionResult> GetTemplateById(Guid templateId)
        {
            try
            {
                var existingTemplate = await _templateRepository.GetTemplateByIdAsync(templateId);

                if (existingTemplate == null)
                { return StatusCode(404, "Not Found"); }

                var returnTemplate = new TemplateDto
                {
                    TemplateId = existingTemplate.TemplateId,
                    TemplateName = existingTemplate.TemplateName,
                    TemplateDescription = existingTemplate.TemplateDescription,
                    TemplateTest = existingTemplate.TemplateTest,
                    TempCreateDate = existingTemplate.TempCreateDate,
                    IsDeleted = existingTemplate.IsDeleted,
                    Feedback = existingTemplate.Feedback,
                    TempStatusId = existingTemplate.TempStatusId,
                    TemplateStatusName = existingTemplate.TemplateStatus.TempStatusName
                };

                return Ok(returnTemplate);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");

            }
        }

        [HttpGet]
        [Route("GetAllTemplates")]
        public async Task<IActionResult> GetAllTemplates()
        {
            try
            {
                //Retrieve list from repository
                var templates = await _templateRepository.GetAllTemplatesAsync();

                //Map domain model to dto using list retrieved from the repository
                var response = new List<TemplateDto>();
                foreach (var template in templates)
                {
                    response.Add(new TemplateDto
                    {
                        TemplateId = template.TemplateId,
                        TemplateName = template.TemplateName,
                        TemplateDescription = template.TemplateDescription,
                        TemplateTest = template.TemplateTest,
                        TempCreateDate = template.TempCreateDate,
                        IsDeleted = template.IsDeleted,
                        Feedback = template.Feedback,
                        TempStatusId = template.TempStatusId,
                        TemplateStatusName = template.TemplateStatus.TempStatusName
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
        [Route("GetAllTempStatuses")]
        public async Task<IActionResult> GetAllTempStatuses()
        {
            try
            {
                var tempStatuses = await _templateRepository.GetTemplateStatusesAsync();

                var response = new List<TemplateStatusDto>();
                foreach (var tempStatus in tempStatuses)
                {
                    response.Add(new TemplateStatusDto
                    {
                        TempStatusId = tempStatus.TempStatusId,
                        TempStatusName = tempStatus.TempStatusName
                    });
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support. " + ex.Message);
            }
        }


        [HttpGet]
        [Route("GetAllApprovedTemplates")]
        public async Task<IActionResult> GetAllApprovedTemplates()
        {
            try
            {
                //Retrieve list from repository
                var templates = await _templateRepository.GetAllTemplatesAsync();

                //Map domain model to dto using list retrieved from the repository
                var response = new List<TemplateDto>();
                foreach (var template in templates)
                {
                    if (template.TempStatusId == 4)
                    {
                        response.Add(new TemplateDto
                        {
                            TemplateId = template.TemplateId,
                            TemplateName = template.TemplateName,
                            TemplateDescription = template.TemplateDescription,
                            TemplateTest = template.TemplateTest,
                            TempCreateDate = template.TempCreateDate,
                            IsDeleted = template.IsDeleted,
                            Feedback = template.Feedback,
                            TempStatusId = template.TempStatusId,
                            TemplateStatusName = template.TemplateStatus.TempStatusName
                        });
                    }
                }
                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpPut]
        [Route("UpdateTemplate/{templateId}")]
        public async Task<ActionResult<TemplateDto>> UpdateProject(Guid templateId, TemplateDto model)
        {
            try
            {
                var result = await _templateRepository.GetTemplateByIdAsync(templateId);

                if (result == null)
                    return StatusCode(404, "Not Found, the requested project does not exist");
                else
                {
                    if (result.TempStatusId == 1)
                    {
                        result.TemplateName = model.TemplateName;
                        result.TemplateDescription = model.TemplateDescription;
                        result.TemplateTest = model.TemplateTest;
                        result.TempCreateDate = model.TempCreateDate;
                        result.IsDeleted = model.IsDeleted;
                        result.TempStatusId = result.TempStatusId;
                    }
                    else
                    {
                        return Ok("This template cannot be edited");
                    }
                }

                if (await _templateRepository.SaveChangesAsync())
                {
                    var returnTemplate = new TemplateDto
                    {
                        TemplateId = result.TemplateId,
                        TemplateName = result.TemplateName,
                        TemplateDescription = result.TemplateDescription,
                        TemplateTest = result.TemplateTest,
                        TempCreateDate = result.TempCreateDate,
                        IsDeleted = result.IsDeleted,
                        Feedback = result.Feedback,
                        TempStatusId = result.TempStatusId,
                        TemplateStatusName = result.TemplateStatus.TempStatusName
                    };

                    return Ok(returnTemplate); 
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return StatusCode(400, "Bad Request, your request is invalid!");
        }

        [HttpDelete]
        [Route("RemoveTemplate/{templateId}")]
        public async Task<IActionResult> RemoveTemplate(Guid templateId)
        {
            try
            {
                var existingTemplate = await _templateRepository.GetTemplateByIdAsync(templateId);

                if (existingTemplate == null)
                    return StatusCode(404, "Not Found, the requested project does not exist");
                else
                {
                    _templateRepository.DeleteTemplate(templateId);

                }

                if (await _templateRepository.SaveChangesAsync())
                {
                    var returnTemplate = new TemplateDto
                    {
                        TemplateId = existingTemplate.TemplateId,
                        TemplateName = existingTemplate.TemplateName,
                        TemplateDescription = existingTemplate.TemplateDescription,
                        TemplateTest = existingTemplate.TemplateTest,
                        TempCreateDate = existingTemplate.TempCreateDate,
                        IsDeleted = existingTemplate.IsDeleted,
                        Feedback = existingTemplate.Feedback,
                        TempStatusId = existingTemplate.TempStatusId,
                        TemplateStatusName = existingTemplate.TemplateStatus.TempStatusName
                    };

                    return Ok(returnTemplate);
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return StatusCode(400, "Bad Request, your request is invalid!");
        }

        [HttpGet]
        [Route("GetTemplateTestStepsById/{templateId}")]
        public async Task<IActionResult> GetTemplateTestStepsById(Guid templateId)
        {
            try
            {
                var testSteps = await _templateRepository.GetTemplateTestSteps(templateId);

                //Map domain model to dto using list retrieved from the repository
                var response = new List<TemplateTestStepDto>();
                foreach (var testStep in testSteps)
                {
                    response.Add(new TemplateTestStepDto
                    {
                        TempTestStepId = testStep.TempTestStepId,
                        TempTestStepDescription = testStep.TempTestStepDescription,
                        TempTestStepRole = testStep.TempTestStepRole,
                        TempTestStep = testStep.TempTestStep,
                        TempTestStepData = testStep.TempTestStepData,
                        TempAdditionalInfo = testStep.TempAdditionalInfo,
                        IsDeleted = testStep.IsDeleted,
                        TemplateId = testStep.TemplateId,
                        //StepOrder = testStep.StepOrder
                    });
                }
                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");

            }
        }

        [HttpPost]
        [Route("AddTemplateTestStep/{templateId}")]
        public async Task<IActionResult> AddLogo(Guid templateId, TemplateTestStepViewModel TTSmodel)
        {
            try
            {
                var newTTestStep = new TemplateTestStep
                {
                    TempTestStepDescription = TTSmodel.TempTestStepDescription,
                    TempTestStepRole = TTSmodel.TempTestStepRole,
                    TempTestStep = TTSmodel.TempTestStep,
                    TempTestStepData = TTSmodel.TempTestStepData,
                    TempAdditionalInfo = TTSmodel.TempAdditionalInfo,
                    IsDeleted = false,
                    TemplateId= templateId,
                    //StepOrder = TTSmodel.StepOrder
                };
                await _templateRepository.CreateTemplateTestStep(newTTestStep);

                var getTTestStep = new TemplateTestStepDto
                {
                    TempTestStepId = newTTestStep.TempTestStepId,
                    TempTestStepDescription = newTTestStep.TempTestStepDescription,
                    TempTestStepRole = newTTestStep.TempTestStepRole,
                    TempTestStep = newTTestStep.TempTestStep,
                    TempTestStepData = newTTestStep.TempTestStepData,
                    TempAdditionalInfo = newTTestStep.TempAdditionalInfo,
                    IsDeleted = newTTestStep.IsDeleted,
                    TemplateId = newTTestStep.TemplateId,
                    //StepOrder = newTTestStep.StepOrder
                };

                return Ok(getTTestStep);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpPut]
        [Route("UpdateTemplateTestStep/{TempTSId}")]
        public async Task<ActionResult<TemplateDto>> UpdateTemplateTestStep(Guid TempTSId, TemplateTestStepDto model)
        {
            try
            {
                var result = await _templateRepository.GetTemplateTestStepByIdAsync(TempTSId);

                if (result == null)
                    return StatusCode(404, "Not Found, the requested project does not exist");
                else
                {
                    result.TempTestStepDescription = model.TempTestStepDescription;
                    result.TempTestStepRole = model.TempTestStepRole;
                    result.TempTestStep = model.TempTestStep;
                    result.TempTestStepData = model.TempTestStepData;
                    result.IsDeleted = model.IsDeleted;
                    result.TempAdditionalInfo = model.TempAdditionalInfo ;
                    result.TemplateId = result.TemplateId;
                    //result.StepOrder = model.StepOrder;
                }

                if (await _templateRepository.SaveChangesAsync())
                { return Ok(result); }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return StatusCode(400, "Bad Request, your request is invalid!");
        }

        //[HttpPut]
        //[Route("UpdateTestStepsOrder")]
        //public async Task<IActionResult> UpdateTestStepsOrder(List<TemplateTestStepDto> steps)
        //{
        //    try
        //    {
        //        var testSteps = steps.Select(s => new TemplateTestStep
        //        {
        //            TempTestStepId = s.TempTestStepId,
        //            StepOrder = s.StepOrder
        //        }).ToList();

        //        var result = await _templateRepository.UpdateTestStepsOrder(testSteps);

        //        if (result)
        //        {
        //            return Ok();
        //        }

        //        return StatusCode(400, "Bad Request, your request is invalid!");
        //    }
        //    catch (Exception)
        //    {
        //        return StatusCode(500, "Internal Server Error. Please contact support.");
        //    }
        //}

        [HttpDelete]
        [Route("RemoveTemplateTestStep/{TempTSId}")]

        public async Task<IActionResult> RemoveProject(Guid TempTSId)
        {
            try
            {
                var existingTTS = await _templateRepository.GetTemplateTestStepByIdAsync(TempTSId);

                if (existingTTS == null)
                    return StatusCode(404, "Not Found, the requested project does not exist");
                else
                {
                    _templateRepository.DeleteTemplateTestStep(existingTTS);

                }

                if (await _templateRepository.SaveChangesAsync())
                {
                    var returnTTS = new TemplateTestStepDto
                    {
                        TempTestStepId = existingTTS.TempTestStepId,
                        TempTestStepDescription = existingTTS.TempTestStepDescription,
                        TempTestStepRole = existingTTS.TempTestStepRole,
                        TempTestStep = existingTTS.TempTestStep,
                        TempTestStepData = existingTTS.TempTestStepData,
                        TempAdditionalInfo = existingTTS.TempAdditionalInfo,
                        IsDeleted = existingTTS.IsDeleted,
                        TemplateId = existingTTS.TemplateId,
                        //StepOrder = existingTTS.StepOrder,
                    };

                    return Ok(returnTTS);
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return StatusCode(400, "Bad Request, your request is invalid!");
        }

        [HttpPut]
        [Route("SubmitTemplate/{templateId}")]
        public async Task<ActionResult<TemplateDto>> SubmitTemplate(Guid templateId, TemplateDto model)
        {
            try
            {
                var result = await _templateRepository.GetTemplateByIdAsync(templateId);

                if (result == null)
                    return StatusCode(404, "Not Found, the requested project does not exist");
                else
                {
                    result.TemplateName = result.TemplateName;
                    result.TemplateDescription = result.TemplateDescription;
                    result.TemplateTest = result.TemplateTest;
                    result.TempCreateDate = result.TempCreateDate;
                    result.IsDeleted = result.IsDeleted;
                    result.TempStatusId = 3; //Pending Review
                }

                if (await _templateRepository.SaveChangesAsync())
                { return Ok(result); }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return StatusCode(400, "Bad Request, your request is invalid!");
        }

        [HttpPut]
        [Route("ApproveTemplate/{templateId}")]
        public async Task<ActionResult<TemplateDto>> ApproveTemplate(Guid templateId, TemplateDto model)
        {
            try
            {
                var result = await _templateRepository.GetTemplateByIdAsync(templateId);

                if (result == null)
                    return StatusCode(404, "Not Found, the requested project does not exist");
                else
                {
                    if (result.TempStatusId == 3)
                    {
                        result.TemplateName = result.TemplateName;
                        result.TemplateDescription = result.TemplateDescription;
                        result.TemplateTest = result.TemplateTest;
                        result.TempCreateDate = result.TempCreateDate;
                        result.IsDeleted = result.IsDeleted;
                        result.Feedback = model.Feedback;
                        result.TempStatusId = 4; //Approved
                    }
                    else
                    {
                        return Ok("This template cannot be approved");
                    }
                }

                if (await _templateRepository.SaveChangesAsync())
                { return Ok(result); }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error. Please contact support." + ex.Message);
            }
            return StatusCode(400, "Bad Request, your request is invalid!");
        }

        [HttpPut]
        [Route("RejectTemplate/{templateId}")]
        public async Task<ActionResult<TemplateDto>> RejectTemplate(Guid templateId, TemplateDto model)
        {
            try
            {
                var result = await _templateRepository.GetTemplateByIdAsync(templateId);

                if (result == null)
                    return StatusCode(404, "Not Found, the requested project does not exist");
                else
                {
                    if (result.TempStatusId == 3)
                    {
                        result.TemplateName = result.TemplateName;
                        result.TemplateDescription = result.TemplateDescription;
                        result.TemplateTest = result.TemplateTest;
                        result.TempCreateDate = result.TempCreateDate;
                        result.IsDeleted = result.IsDeleted;
                        result.Feedback = model.Feedback;
                        result.TempStatusId = 5; //Rejected
                    }
                    else
                    {
                        return Ok("This template cannot be rejected");
                    }
                }

                if (await _templateRepository.SaveChangesAsync())
                { return Ok(result); }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return StatusCode(400, "Bad Request, your request is invalid!");
        }

        [HttpPut]
        [Route("AcknowledgeRejection/{templateId}")]
        public async Task<ActionResult<TemplateDto>> AcknowledgeRejection(Guid templateId, TemplateDto model)
        {
            try
            {
                var result = await _templateRepository.GetTemplateByIdAsync(templateId);

                if (result == null)
                    return StatusCode(404, "Not Found, the requested project does not exist");
                else
                {
                    if (result.TempStatusId == 5)
                    {
                        result.TemplateName = result.TemplateName;
                        result.TemplateDescription = result.TemplateDescription;
                        result.TemplateTest = result.TemplateTest;
                        result.TempCreateDate = result.TempCreateDate;
                        result.IsDeleted = result.IsDeleted;
                        result.Feedback = null;
                        result.TempStatusId = 1; //Draft
                    }
                    else
                    {
                        return Ok("This template cannot be rejected");
                    }
                }

                if (await _templateRepository.SaveChangesAsync())
                { return Ok(result); }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return StatusCode(400, "Bad Request, your request is invalid!");
        }

        [HttpPut]
        [Route("ReDraftTemplate/{templateId}")]
        public async Task<ActionResult<TemplateDto>> ReDraftTemplate(Guid templateId, TemplateDto model)
        {
            try
            {
                var result = await _templateRepository.GetTemplateByIdAsync(templateId);

                if (result == null)
                    return StatusCode(404, "Not Found, the requested project does not exist");
                else
                {
                    if (result.TempStatusId == 4)
                    {
                        result.TemplateName = result.TemplateName;
                        result.TemplateDescription = result.TemplateDescription;
                        result.TemplateTest = result.TemplateTest;
                        result.TempCreateDate = result.TempCreateDate;
                        result.IsDeleted = result.IsDeleted;
                        result.Feedback = null;
                        result.TempStatusId = 1; //Draft
                    }
                    else
                    {
                        return Ok("This template cannot be rejected");
                    }
                }

                if (await _templateRepository.SaveChangesAsync())
                { return Ok(result); }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return StatusCode(400, "Bad Request, your request is invalid!");
        }

        [HttpGet]
        [Route("CopyTemplate/{templateId}")]
        public async Task<IActionResult> CopyTemplate(Guid templateId)
        {
            try
            {
                var existingTemplate = await _templateRepository.GetTemplateByIdAsync(templateId);


                if (existingTemplate.TempStatusId == 4)
                {
                    var template = new TemplateDto
                    {
                        TemplateId = existingTemplate.TemplateId,
                        TemplateName = existingTemplate.TemplateName,
                        TemplateDescription = existingTemplate.TemplateDescription,
                        TemplateTest = existingTemplate.TemplateTest,
                        TempCreateDate = existingTemplate.TempCreateDate,
                        IsDeleted = existingTemplate.IsDeleted,
                        TempStatusId = existingTemplate.TempStatusId,
                        TemplateStatusName = existingTemplate.TemplateStatus.TempStatusName
                    };

                    var existingTTestSteps = await _templateRepository.GetTemplateTestSteps(templateId);

                    var templateDetails = new CopyTemplateDetails
                    {
                        Template = template,
                        TemplateTestSteps = existingTTestSteps.ToList()
                    };

                    return Ok(templateDetails);
                }
                else
                {
                    return Ok("This template cannot be copied");
                }
                
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

    }
}
