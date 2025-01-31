using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.DTO;
using TestScriptTracker.Models.ViewModel;
using TestScriptTracker.Repositories.Implementation;
using TestScriptTracker.Repositories.Interface;

namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusController : Controller
    {
        private readonly IGenericRepository _repository;
        private readonly IStatusRepository _statusRepository;
        public StatusController(IGenericRepository repository, IStatusRepository statusRepository) 
        {
            _repository = repository;
            _statusRepository = statusRepository;
        }

        [HttpPost]
        [Route("CreateStatus")]
        public async Task<IActionResult> AddStatus(StatusViewModel model)
        {
            try
            {
                var status = new Status
                {
                    StatusName = model.StatusName,
                    StatusDescription = model.StatusDescription,
                    StatusTypeId = model.StatusTypeId,
                    ProjectId = model.ProjectId
                };

                await _statusRepository.CreateStatus(status);

                return Ok(status);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support if the problem persists.");
            }
        }

        [HttpGet]
        [Route("GetStatuses")]
        public async Task<IActionResult> GetAllStatuses()
        {
            try
            {
                var results = await _statusRepository.GetAllStatusesAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support if the problem persists.");
            }
        }

        [HttpGet("GetStatusById/{id}")]
        public async Task<IActionResult> GetStatusById(Guid id)
        {
            try
            {
                var status = await _statusRepository.GetStatusByIdAsync(id);
                if (status == null)
                {
                    return NotFound();
                }
                return Ok(status);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error retrieving status. Please contact support if the problem persists.");
            }
        }

        [HttpPut("UpdateStatus/{id}")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] StatusViewModel model)
        {
            try
            {
                var status = await _statusRepository.GetStatusByIdAsync(id);
                if (status == null)
                {
                    return NotFound();
                }

                status.StatusName = model.StatusName;
                status.StatusDescription = model.StatusDescription;
                status.StatusTypeId = status.StatusTypeId;
                status.ProjectId = status.ProjectId;

                var updatedStatus = await _statusRepository.UpdateStatusAsync(status);

                return Ok(updatedStatus);
            }

            catch (Exception ex)
            {
                return StatusCode(500, "Error updating internal status. Please contact support if the problem persists." );
            }
        }

        [HttpDelete]
        [Route("DeleteStatus/{id}")]
        public async Task<IActionResult> DeleteStatus(Guid id)
        {
            try
            {
                var status = await _statusRepository.GetStatusByIdAsync(id);

                if (status == null)
                    return NotFound();

               await _statusRepository.DeleteStatusAsync(id);

                return Ok(status);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support if the problem persists.");
            }
        }

        [HttpGet]
        [Route("GetStatusTypes")]
        public async Task<IActionResult> GetAllStatusTypes()
        {
            try
            {
                var results = await _statusRepository.GetAllStatusTypesAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support if the problem persists.");
            }
        }

        // This endpoint will change after the TestScript repository is implemented -- NOT USED ANYMORE
        //[HttpPut("ApplyStatus/{id}")]
        //public async Task<IActionResult> ApplyStatus(Guid id, int testScriptId) // The Endpoint only receives the status ID and TestScript Id because
        //{                                                                       // it only needs to update the StatusId attribute in a test script.
        //    try
        //    {
        //        var testScript = await _repository.GetByIdAsync<TestScript, Guid>(id);
        //        if (testScript == null)
        //        {
        //            return NotFound();
        //        }

        //        testScript.StatusId = id;
        //        var updatedTestScript = await _repository.UpdateEntityAsync(testScript, "TestScriptId");

        //        return Ok(updatedTestScript);
        //    }

        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, "Error applying status to the test script. Please contact support if the problem persists.");
        //    }
        //}
    }


}
