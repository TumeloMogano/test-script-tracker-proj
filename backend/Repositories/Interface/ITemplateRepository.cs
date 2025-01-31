using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Repositories.Interface
{
    public interface ITemplateRepository
    {
        Task<Template> CreateTemplate(Template template);
        Task<Template[]> GetAllTemplatesAsync();
        Task<Template> GetTemplateByIdAsync(Guid templateId);
        Task<TemplateTestStep> CreateTemplateTestStep(TemplateTestStep templateTS);
        Task<TemplateTestStep[]> GetTemplateTestSteps(Guid templateId);
        //Task<bool> UpdateTestStepsOrder(List<TemplateTestStep> testSteps);
        Task<TemplateTestStep> GetTemplateTestStepByIdAsync(Guid tempTSId);
        Task<bool> SaveChangesAsync();
        Task<Template> DeleteTemplate(Guid templateId);
        //void DeleteTemplate<T>(T entity) where T : class;
        void DeleteTemplateTestStep<T>(T entity) where T : class;
        //Task<TestScript> CreateTestScript(TestScript newTestScript);
        //Task<TestStep> CreateTestStep(TestStep newTestStep);



        //OTHER*****************************************************************
        Task<TeamMembers[]> GetAllTeamMembersAsync();
        Task<StatusType[]> GetAllStatusTypesAsync();
        Task<RegistrationStatus[]> GetAllRegStatusesAsync();
        Task<TestScript[]> GetAllTestScriptsAsync();
        Task<TestScriptAssignment[]> GetAllTSAssignmentsAsync();
        Task<Defect[]> GetAllDefectsAsync();
        Task<DefectStatus[]> GetAllDefectStatusesAsync();
        Task<Phase[]> GetAllPhasesAsync();
        Task<StatusType[]> GetAllStatusesAsync();
        Task<TemplateStatus[]> GetTemplateStatusesAsync();

    }
}
