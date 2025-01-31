using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestScriptTracker.Data;
using TestScriptTracker.PDFServices;

namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HelpController : ControllerBase
    {
        private readonly PDFService _pdfService;
        private readonly AppDbContext _dbContext;

        public HelpController(PDFService pDFService, AppDbContext dbContext)
        {
            this._pdfService = pDFService;
            _dbContext = dbContext;
        }

        [HttpGet("generate-help-pdf")]
        public async Task<IActionResult> GenerateHelpPdf()
        {
            var helpEntries = await _pdfService.GetHelpEntriesFromDatabase();

            var pdfBytes = _pdfService.CreateHelpPdf(helpEntries);

            return File(pdfBytes, "application/pdf", "Help.pdf");
        }
    }
}
