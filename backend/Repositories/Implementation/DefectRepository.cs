using Microsoft.EntityFrameworkCore;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Repositories.Interface;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace TestScriptTracker.Repositories.Implementation
{
    public class DefectRepository : IDefectRepository
    {
        private readonly AppDbContext dbContext;
        public DefectRepository(AppDbContext _dbContext)
        {
            dbContext = _dbContext;
        }
        //Log Defect
        public async Task<Defect> LogDefectAsync(Defect defect)
        {
            await dbContext.Defects.AddAsync(defect);
            await dbContext.SaveChangesAsync();

            return defect;
        }
        //List of all defects in the system 
        public async Task<IEnumerable<Defect?>> GetsAllDefectsAsync()
        {
            return await dbContext.Defects.ToListAsync();
        }
        //List of all defects belonging to a Test Script
        public async Task<IEnumerable<Defect?>> GetsDefectsAsync(Guid tsId)
        {
            return await dbContext.Defects.Where(ts => ts.TestScriptId == tsId).ToListAsync();
        }
        //Search/View Defect
        public async Task<Defect?> GetDefectAsync(Guid defectId)
        {
            return await dbContext.Defects.SingleOrDefaultAsync(x => x.DefectId == defectId);
        }
        public string GetDefectStatus(int? defectStatusId)
        {
            string outPut = " ";
            foreach (var st in dbContext.DefectStatus)
            {
                if (st.DefectStatusId == defectStatusId)
                {
                    outPut = st.DefectStatusName;
                }
            }
            return outPut;
        }
        public string GetTestScript(Guid? tsId)
        {
            string outPut = " ";
            foreach (var st in dbContext.TestScripts)
            {
                if (st.TestScriptId == tsId)
                {
                    outPut = st.Process;
                }
            }
            return outPut;
        }
        //Update Defect
        public async Task UpdateDefectAsync(Defect defect)
        {
            dbContext.Entry(defect).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
        }
        //Remove Defect
        public async Task RemoveDefectAsync(Defect defect)
        {
            dbContext.Defects.Remove(defect);
            await dbContext.SaveChangesAsync();
            //dbContext.Entry(defect).State = EntityState.Modified;
            //await dbContext.SaveChangesAsync();
        }

        //Search By status
        public async Task<IEnumerable<Defect?>> GetDefectByStatusIdAsync(int statusId)
        {
            return await dbContext.Defects.Where(df => df.DefectStatusId == statusId).ToListAsync();
        }
        //Resolve Defect -- works like update (used for unresolve and closed)
        public async Task ResolveDefectAsync(Defect defect)
        {
            dbContext.Entry(defect).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
        }
    }
}
