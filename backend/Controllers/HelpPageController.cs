using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HelpPageController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public HelpPageController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        [HttpGet]
        public ActionResult<IEnumerable<HelpPage>> GetHelpItems()
        {
            var helpPageItems = _dbContext.HelpPage.ToList();
            if (helpPageItems == null || !helpPageItems.Any())
            {
                return NotFound("No help items found.");
            }

            return Ok(helpPageItems);
        }

        [HttpGet("search")]
        public ActionResult<IEnumerable<HelpPage>> SearchHelpItems([FromQuery] string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest("Query parameter is required.");
            }

            var helpPageItems = _dbContext.HelpPage
                .Where(h => h.Question.Contains(query) || h.Answer.Contains(query))
                .ToList();

            if (helpPageItems == null || !helpPageItems.Any())
            {
                return NotFound($"No help items found matching the query: {query}");
            }

            return Ok(helpPageItems);
        }
    }
}
