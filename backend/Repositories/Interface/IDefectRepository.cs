using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Repositories.Interface
{
    public interface IDefectRepository
    {

        //Log Defect
        Task<Defect> LogDefectAsync(Defect defect);
        //List of all defects in the system 
        Task<IEnumerable<Defect?>> GetsAllDefectsAsync();
        //List of all defects belonging to a Test Script 
        Task<IEnumerable<Defect?>> GetsDefectsAsync(Guid tsId);
        //Search/View Defect
        Task<Defect?> GetDefectAsync(Guid defectId);
        //Get status 
        string GetDefectStatus(int? defectStatusId);
        //Get Test Script
        string GetTestScript(Guid? tsId);
        //Update Defect
        Task UpdateDefectAsync(Defect defect);
        //Remove Defect
        Task RemoveDefectAsync(Defect defect);
        //Search By status
        Task<IEnumerable<Defect?>> GetDefectByStatusIdAsync(int statusId);
        //Resolve Defect
        Task ResolveDefectAsync(Defect defect);
    }
}
