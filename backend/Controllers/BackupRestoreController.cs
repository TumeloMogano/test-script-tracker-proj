using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestScriptTracker.Models.DTO;
using TestScriptTracker.Services;

namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BackupRestoreController : ControllerBase
    {
        private readonly Backup_RestoreService backupService;

        public BackupRestoreController(Backup_RestoreService backupService)
        {
            this.backupService = backupService;
        }

        [HttpPost]
        [Route("CreateBackup")]
        public async Task<IActionResult> CreateBackup()
        {
            try
            {
                await backupService.CreateBackupAsync();
                return Ok(new { message = "Backup created successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet]
        [Route("GetAllBackups")]
        public IActionResult GetAllBackups()
        {
            try
            {
                var backups = backupService.GetAllBackups();
                return Ok(backups);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPost]
        [Route("RestoreBackup")]
        public async Task<IActionResult> RestoreBackup([FromBody] RestoreBackupRequest request)
        {

            if (string.IsNullOrWhiteSpace(request.BackupName))
            {
                return BadRequest(new { message = "Backup name is required." });
            }

            await backupService.RestoreBackupAsync(request.BackupName);
            return Ok(new { message = "Backup restored successfully." });
        }
    }
}
