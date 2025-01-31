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
    public class TagsController : ControllerBase
    {
        private readonly ITagRepository _tagRepository;
        public TagsController(ITagRepository tagRepository)
        {
            _tagRepository = tagRepository;
        }

        [HttpPost]
        [Route("CreateTag")]
        public async Task<IActionResult> AddTag(TagViewModel model)
        {
            try
            {
                var tag = new Tag
                {
                    TagName = model.TagName,
                    TagDescription = model.TagDescription,
                    TagTypeId = model.TagTypeId
                };

                await _tagRepository.CreateTag(tag);

                return Ok(tag);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support if the problem persists.");
            }
        }

        [HttpGet]
        [Route("GetTags")]
        public async Task<IActionResult> GetAllTags()
        {
            try
            {
                var results = await _tagRepository.GetAllTagsAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support if the problem persists.");
            }
        }

        [HttpGet("GetTagById/{id}")]
        public async Task<IActionResult> GetTagById(Guid id)
        {
            try
            {
                var tag = await _tagRepository.GetTagByIdAsync(id);
                if (tag == null)
                {
                    return NotFound();
                }
                return Ok(tag);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error retrieving Tag. Please contact support if the problem persists.");
            }
        }

        [HttpPut("UpdateTag/{id}")]
        public async Task<IActionResult> UpdateTag(Guid id, [FromBody] TagViewModel model)
        {
            try
            {
                var tag = await _tagRepository.GetTagByIdAsync(id);
                if (tag == null)
                {
                    return NotFound();
                }

                tag.TagName = model.TagName;
                tag.TagDescription = model.TagDescription;
                tag.TagTypeId = tag.TagTypeId;

                var updatedTag = await _tagRepository.UpdateTagAsync(tag);

                return Ok(updatedTag);
            }

            catch (Exception ex)
            {
                return StatusCode(500, "Error updating tag. Please contact support if the problem persists.");
            }
        }

        [HttpDelete]
        [Route("DeleteTag/{id}")]
        public async Task<IActionResult> DeleteTag(Guid id)
        {
            try
            {
                if (await _tagRepository.HasDependenciesAsync(id))
                    return BadRequest(new { message = "The Tag is associated with an existing test script." });

                var result = await _tagRepository.DeleteTagsAsync(id);

                //var result = await _tagRepository.DeleteTagAsync(id);

                if (!result)
                    return NotFound(new { message = "Tag not found." });
                 
                return Ok(new { message = "Tag deleted successfully." });

            }
            catch (Exception ex)
            {
                // Log the exception (optional)
                return StatusCode(500, $"Internal Server Error: {ex.Message}. Please contact support if the problem persists.");
            }
        }


        [HttpGet]
        [Route("GetTagTypes")]
        public async Task<IActionResult> GetAllTagTypes()
        {
            try
            {
                var results = await _tagRepository.GetAllTagTypesAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support if the problem persists.");
            }
        }

        [HttpPost]
        [Route("ApplyTag")]
        public async Task<IActionResult> ApplyTag([FromBody] TsTagRequestDto request)
        {
            if (request == null || request.TestScriptId == Guid.Empty || request.TagId == Guid.Empty)
            {
                return BadRequest("Invalid Inputs.");
            }

            try
            {
                var result = await _tagRepository.ApplyTag(request.TestScriptId, request.TagId);
                return Ok(new { message = "Tag Applied Successfully "});
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete]
        [Route("RemoveAppliedTag")]
        public async Task<IActionResult> RemoveAppliedTag([FromBody] TsTagRequestDto request)
        {
            if (request == null || request.TestScriptId == Guid.Empty || request.TagId == Guid.Empty)
            {
                return BadRequest(new { Message = "Invalid input data." });
            }

            try
            {
                var result = await _tagRepository.RemoveAppliedTag(request.TestScriptId, request.TagId);

                return Ok(new { Message = "Tag removed successfully." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("GetTagByTestScript/{testScriptId:Guid}")]
        public async Task<IActionResult> GetTagByTestScript(Guid testScriptId)
        {
            try
            {
                var tags = await _tagRepository.GetTagByTestScript(testScriptId);
                if (tags == null)
                {
                    return NotFound();
                }

                return Ok(tags);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
