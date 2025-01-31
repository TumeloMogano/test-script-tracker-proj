using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Repositories.Interface;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace TestScriptTracker.Repositories.Implementation
{
    public class TestScriptRepository : ITestScriptRepository
    {
        private readonly AppDbContext dbContext;
        public TestScriptRepository(AppDbContext _dbContext)
        {
            dbContext = _dbContext;
        }
        //Create New Test Script
        public async Task<TestScript> CreateTestScriptAsync(TestScript testScript)
        {
            await dbContext.TestScripts.AddAsync(testScript);
            await dbContext.SaveChangesAsync();
            return testScript;

        }
        //List of Test Scripts in the system
        public async Task<IEnumerable<TestScript>> GetAllScriptsAsync()
        {
            return await dbContext.TestScripts.ToListAsync();
        }
        //List of Test Scripts belonging to a project
        public async Task<IEnumerable<TestScript>> GetScriptsAsync(Guid projectId)
        {
            return await dbContext.TestScripts.Where(ts => ts.ProjectId == projectId && ts.IsDeleted == false).ToListAsync();
        }

        //List of Archived Test Scripts belonging to a project
        public async Task<IEnumerable<TestScript>> GetAScriptsAsync(Guid projectId)
        {
            return await dbContext.TestScripts.Where(ts => ts.ProjectId == projectId && ts.IsDeleted == true).ToListAsync();
        }


        //List of Test Scripts TO TEST belonging to a project
        public async Task<IEnumerable<TestScript>> GetScriptsToTestAsync(Guid projectId)
        {
            return await dbContext.TestScripts.Include(x => x.StatusType).Where(ts => ts.ProjectId == projectId && ts.IsDeleted == false).ToListAsync();
        }


        //List of Step Results in the system
        public async Task<IEnumerable<StepResult>> GetAllStepResultsAsync()
        {
            return await dbContext.StepResults.ToListAsync();
        }

        //List of Status Types in the system
        public async Task<IEnumerable<StatusType>> GetAllStatusTypesAsync()
        {
            return await dbContext.StatusTypes.ToListAsync();
        }




        //Get status by status type
        public string GetStatusType(int statusTypeId)
        {
            string outPut = " ";
            foreach (var st in dbContext.StatusTypes)
            {
                if(st.StatusTypeId == statusTypeId)
                {
                    outPut = st.StatusTypeName;
                }
            }
            return outPut;
        }
        //Get result of test step
        public string GetResult(int? resultId)
        {
            string outPut = " ";
            foreach (var st in dbContext.StepResults)
            {
                if (st.StepResultId == resultId)
                {
                    outPut = st.StepResultName;
                }
            }
            return outPut;
        }
        //Search/View Test Script
        public async Task<TestScript?> GetScriptAsync(Guid scriptId)
        {
            return await dbContext.TestScripts.SingleOrDefaultAsync(x => x.TestScriptId == scriptId);
        }

        public async Task<TestScript?> GetTestScriptByIdAsync(Guid scriptId)
        {
            return await dbContext.TestScripts.Include(x => x.StatusType).SingleOrDefaultAsync(x => x.TestScriptId == scriptId);
        }

        //Search/View Test Script Assignment
        public async Task<TestScriptAssignment?> GetAssignment(Guid scriptId)
        {
            return await dbContext.TestScriptAssignments.SingleOrDefaultAsync(x => x.TestScriptId == scriptId);
        }
        //Search/View Test Script by test attribute
        public async Task<TestScript?> GetScriptByTestAsync(string testName)
        {
            return await dbContext.TestScripts.SingleOrDefaultAsync(x => x.Test == testName);
        }
        //Archive Test Scripts
        public async Task ArchiveScriptAsync(TestScript testScript)
        {
            dbContext.Entry(testScript).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
        }
        //Update Test Script
        public async Task UpdateScriptAsync(TestScript testScript)
        {
            dbContext.Entry(testScript).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
        }
        //Status changes (used same for all status changes)
        public async Task ChangeStatusAsync(TestScript testScript)
        {
            dbContext.Entry(testScript).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
        }
        //Assign Test Script
        public async Task<TestScriptAssignment> AssignTestScriptAsync(TestScriptAssignment assignment)
        {

            await dbContext.TestScriptAssignments.AddAsync(assignment);
            await dbContext.SaveChangesAsync();
            return assignment;
        }

        //Create Test Step
        public async Task<TestStep> CreateTestStepAsync(TestStep testStep)
        {
            await dbContext.TestSteps.AddAsync(testStep);
            await dbContext.SaveChangesAsync();

            return testStep;
        }
        //Get All Steps
        public async Task<IEnumerable<TestStep>> GetAllStepsAsync(Guid scriptId)
        {
            return await dbContext.TestSteps.Where(ts => ts.TestScriptId == scriptId).ToListAsync();
        }

        //Get All Steps
        public async Task<IEnumerable<TestStep>> GetAllStepswithResultNamesAsync(Guid scriptId)
        {
            return await dbContext.TestSteps.Include(x => x.StepResult).Where(ts => ts.TestScriptId == scriptId).ToListAsync();
        }

        //List of Step results in the system
        public async Task<IEnumerable<StepResult>> GetAllResults()
        {
            return await dbContext.StepResults.ToListAsync();
        }
        //
        //Get Test Step?
        public async Task<TestStep?> GetStepAsync(Guid stepId)
        {
            return await dbContext.TestSteps.SingleOrDefaultAsync(x => x.TestStepId == stepId);
        }
        //Update Test Step
        public async Task UpdateStepAsync(TestStep testStep)
        {
            dbContext.Entry(testStep).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
        }
        //Step changes (used same for step result changes)
        public async Task ChangeResultAsync(TestStep testStep)
        {
            dbContext.Entry(testStep).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
        }
        //Remove Test Step
        public async Task RemoveStepAsync(TestStep testStep)
        {
            dbContext.TestSteps.Remove(testStep);
            await dbContext.SaveChangesAsync();
        }

        //Export Test Script
        public async Task<TestScript?> ExportAsync(Guid testScriptId)
        {
            return await dbContext.TestScripts.SingleOrDefaultAsync(ts => ts.TestScriptId == testScriptId);
        }
        //Sign-Off Test Script  -- used for phase changing as well
        public async Task SignOffAsync(Project project)
        {
            //dbContext.Entry(testScript).State = EntityState.Modified;
            dbContext.Entry(project).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
        }

    }
}
