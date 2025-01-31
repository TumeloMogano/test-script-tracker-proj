namespace TestScriptTracker.Repositories.Interface
{
    public interface IGenericRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<T?> UpdateEntityAsync<T>(T entity, string primaryKeyPropertyName) where T : class;
        Task<bool> SaveChangesAsync();
        Task<T[]> GetAllAsync<T>() where T : class;
        Task<T> GetByIdAsync<T, TKey>(TKey id) where T : class where TKey : struct;
        void Attach<T>(T entity) where T : class;
    }
}
