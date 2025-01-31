using HarfBuzzSharp;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Repositories.Interface
{
    public interface ITestScriptRepository
    {
        //Create New Test Script
        //Task CreateTestScriptAsync(TestScript testScript);
        Task<TestScript> CreateTestScriptAsync(TestScript testScript);
        //List of Test Scripts in the system
        Task<IEnumerable<TestScript>> GetAllScriptsAsync();
        //List of Test Scripts belonging to a project
        Task<IEnumerable<TestScript>> GetScriptsAsync(Guid projectId);

        //List of Archived Test Scripts belonging to a project
        Task<IEnumerable<TestScript>> GetAScriptsAsync(Guid projectId);


        //List of Step Results in the system
        Task<IEnumerable<StepResult>> GetAllStepResultsAsync();

        //List of Status Types in the system
        Task<IEnumerable<StatusType>> GetAllStatusTypesAsync();

        //List of Test Scripts TO TEST belonging to a project
        Task<IEnumerable<TestScript>> GetScriptsToTestAsync(Guid projectId);

        //Get status by status type
        string GetStatusType(int statusTypeId);
        //Search/View Test Script
        Task<TestScript?> GetScriptAsync(Guid scriptId);

        Task<TestScript?> GetTestScriptByIdAsync(Guid scriptId);
        //Search/View Test Script Assignment
        Task<TestScriptAssignment?> GetAssignment(Guid scriptId);
        //Search/View Test Script by test attribute
        Task<TestScript?> GetScriptByTestAsync(string testName);
        //Archive Test Scripts
        Task ArchiveScriptAsync(TestScript testScript);
        //Update Test Script
        Task UpdateScriptAsync(TestScript testScript);
        //Status changes (used same for all status changes)
        Task ChangeStatusAsync(TestScript testScript);
        //Assign Test Script
        //Task<TestScriptAssignment> AssignScriptAsync(TestScriptAssignment assignment, TestScript testScript);
        Task<TestScriptAssignment> AssignTestScriptAsync(TestScriptAssignment assignment);

        //Create Test Step
        Task<TestStep> CreateTestStepAsync(TestStep testStep);
        //Get All Steps
        Task<IEnumerable<TestStep>> GetAllStepsAsync(Guid scriptId);

        Task<IEnumerable<TestStep>> GetAllStepswithResultNamesAsync(Guid scriptId);

        Task<IEnumerable<StepResult>> GetAllResults();
        //Get Test Step?
        Task<TestStep?> GetStepAsync(Guid stepId);
        //Get result of test step
        string GetResult(int? resultId);
        //Update Test Step
        Task UpdateStepAsync(TestStep testStep);
        //Step changes (used same for all step result changes)
        Task ChangeResultAsync(TestStep testStep);
        //Remove Test Step
        Task RemoveStepAsync(TestStep testStep);

        //Export Test Script
        Task<TestScript?> ExportAsync(Guid testScriptId);
        //Sign-Off Test Script
        Task SignOffAsync(Project project);
    }
}
