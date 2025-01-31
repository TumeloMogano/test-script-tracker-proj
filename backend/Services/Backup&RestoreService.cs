using Org.BouncyCastle.Asn1.X509;
using System.Data.SqlClient;

namespace TestScriptTracker.Services
{
    public class Backup_RestoreService
    {
        private readonly string _connectionString;
        private readonly string _backupDirectory;
        public Backup_RestoreService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("TestScriptTrackerConnectionString")!;
            _backupDirectory = configuration["BackupDirectory"]!;

            // Ensure the backup directory exists
            if (!Directory.Exists(_backupDirectory))
            {
                Directory.CreateDirectory(_backupDirectory);
            }
        }

        public async Task CreateBackupAsync()
        {
            var backupName = $"Backup TestScriptTrackerDb - {DateTime.Now:yyyy-MM-dd_HH-mm-ss}.bak";
            var backupPath = Path.Combine(_backupDirectory, backupName);

            var query = $"BACKUP DATABASE TestScriptTrackerDb TO DISK = '{backupPath}'";

            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand(query, connection);
            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
        }

        public IEnumerable<string> GetAllBackups()
        {
            return Directory.GetFiles(_backupDirectory, "*.bak")
                .Select(Path.GetFileName)!;
        }

        public async Task RestoreBackupAsync(string backupName)
        {
            var backupPath = Path.Combine(_backupDirectory, backupName);

            // New file paths for the database and log files
            var newDatabaseFilePath = Path.Combine(_backupDirectory, "TestScriptTrackerDb.mdf");
            var newLogFilePath = Path.Combine(_backupDirectory, "TestScriptTrackerDb_log.ldf");

            var query = $@"
            ALTER DATABASE TestScriptTrackerDb SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
            RESTORE DATABASE TestScriptTrackerDb 
            FROM DISK = '{backupPath}' 
            WITH REPLACE, 
            MOVE 'TestScriptTrackerDb' TO '{newDatabaseFilePath}', 
            MOVE 'TestScriptTrackerDb_log' TO '{newLogFilePath}';
            ALTER DATABASE TestScriptTrackerDb SET MULTI_USER;";


            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var changeDbCommand = new SqlCommand("USE master", connection);
            await changeDbCommand.ExecuteNonQueryAsync();

            using var command = new SqlCommand(query, connection);
            await command.ExecuteNonQueryAsync();

        }
    }
}
