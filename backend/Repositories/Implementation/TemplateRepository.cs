using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Repositories.Interface;
using System;

namespace TestScriptTracker.Repositories.Implementation
{
    public class TemplateRepository : ITemplateRepository
    {
        private readonly AppDbContext dbContext;
        public TemplateRepository(AppDbContext _dbContext)
        {
            dbContext = _dbContext;
        }
        public async Task<Template> CreateTemplate(Template template)
        {
            await dbContext.Templates.AddAsync(template);
            await dbContext.SaveChangesAsync();

            return template;
        }

        public async Task<Template[]> GetAllTemplatesAsync()
        {
            IQueryable<Template> query = dbContext.Templates.Include(s => s.TemplateStatus);
            return await query.ToArrayAsync();
        }

        public async Task<Template> GetTemplateByIdAsync(Guid templateId)
        {
            IQueryable<Template> newquery = dbContext.Templates.Include(s => s.TemplateStatus)
                .Where(t => t.TemplateId == templateId);
            return await newquery.FirstOrDefaultAsync();
        }

        public async Task<TemplateTestStep> CreateTemplateTestStep(TemplateTestStep templateTS)
        {
            await dbContext.TemplateTestSteps.AddAsync(templateTS);
            await dbContext.SaveChangesAsync();

            return templateTS;
        }

        public async Task<TemplateTestStep[]> GetTemplateTestSteps(Guid templateId)
        {
            //IQueryable<TemplateTestStep> newquery = dbContext.TemplateTestSteps.Where(t => t.TemplateId == templateId);
            IQueryable<TemplateTestStep> query = dbContext.TemplateTestSteps.Where(t => t.TemplateId == templateId);
            return await query.ToArrayAsync();
        }

        //public async Task<bool> UpdateTestStepsOrder(List<TemplateTestStep> testSteps)
        //{
        //    foreach (var step in testSteps)
        //    {
        //        var existingStep = await dbContext.TemplateTestSteps.FindAsync(step.TempTestStepId);
        //        if (existingStep != null)
        //        {
        //            existingStep.StepOrder = step.StepOrder;
        //        }
        //    }
        //    return await dbContext.SaveChangesAsync() > 0;
        //}

        public async Task<TemplateTestStep> GetTemplateTestStepByIdAsync(Guid tempTSId)
        {
            IQueryable<TemplateTestStep> newquery = dbContext.TemplateTestSteps.Where(t => t.TempTestStepId == tempTSId);
            return await newquery.FirstOrDefaultAsync();
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await dbContext.SaveChangesAsync() > 0;
        }

        //public void DeleteTemplate<T>(T entity) where T : class
        //{
        //    dbContext.Remove(entity);
        //}

        public async Task<Template> DeleteTemplate(Guid templateId)
        {
            var template = dbContext.Templates.Include(ts => ts.TemplateTestSteps).FirstOrDefault(t => t.TemplateId == templateId);
            dbContext.TemplateTestSteps.RemoveRange(template.TemplateTestSteps);
            dbContext.Templates.Remove(template);

            return template;
        }

        public void DeleteTemplateTestStep<T>(T entity) where T : class
        {
            dbContext.Remove(entity);
        }

        //public async Task<TestScript> CreateTestScript(TestScript newTestScript)
        //{
        //    await dbContext.TestScripts.AddAsync(newTestScript);
        //    await dbContext.SaveChangesAsync();
        //    return newTestScript;
        //}

        //public async Task<TestStep> CreateTestStep(TestStep newTestStep)
        //{
        //    await dbContext.TestSteps.AddAsync(newTestStep);
        //    await dbContext.SaveChangesAsync();
        //    return newTestStep;
        //}



        //OTHER*****************************************************************

        public async Task<TeamMembers[]> GetAllTeamMembersAsync()
        {
            IQueryable<TeamMembers> query = dbContext.TeamMembers;
            return await query.ToArrayAsync();
        }

        public async Task<StatusType[]> GetAllStatusTypesAsync()
        {
            IQueryable<StatusType> query = dbContext.StatusTypes;
            return await query.ToArrayAsync();
        }

        public async Task<RegistrationStatus[]> GetAllRegStatusesAsync()
        {
            IQueryable<RegistrationStatus> query = dbContext.RegistrationStatus;
            return await query.ToArrayAsync();
        }

        public async Task<TestScript[]> GetAllTestScriptsAsync()
        {
            IQueryable<TestScript> query = dbContext.TestScripts.Include(ts => ts.StatusType);
            return await query.ToArrayAsync();
        }

        public async Task<TestScriptAssignment[]> GetAllTSAssignmentsAsync()
        {
            IQueryable<TestScriptAssignment> query = dbContext.TestScriptAssignments;
            return await query.ToArrayAsync();
        }

        public async Task<Defect[]> GetAllDefectsAsync()
        {
            IQueryable<Defect> query = dbContext.Defects;
            return await query.ToArrayAsync();
        }

        public async Task<DefectStatus[]> GetAllDefectStatusesAsync()
        {
            IQueryable<DefectStatus> query = dbContext.DefectStatus;
            return await query.ToArrayAsync();
        }

        public async Task<Phase[]> GetAllPhasesAsync()
        {
            IQueryable<Phase> query = dbContext.Phases;
            return await query.ToArrayAsync();
        }

        public async Task<StatusType[]> GetAllStatusesAsync()
        {
            IQueryable<StatusType> query = dbContext.StatusTypes;
            return await query.ToArrayAsync();
        }

        public async Task<TemplateStatus[]> GetTemplateStatusesAsync()
        {
            IQueryable<TemplateStatus> query = dbContext.TemplateStatus.Where(ts => ts.TempStatusId != 2);
            return await query.ToArrayAsync();
        }
    }
}
