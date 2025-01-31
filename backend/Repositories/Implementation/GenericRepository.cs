using TestScriptTracker.Data;
using TestScriptTracker.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace TestScriptTracker.Repositories.Implementation
{
    public class GenericRepository : IGenericRepository
    {
        protected readonly AppDbContext _appDbContext;

        public GenericRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

// Generic Retrieve All Records Method.
        public async Task<T[]> GetAllAsync<T>() where T : class
        {
            return await _appDbContext.Set<T>().ToArrayAsync();
        }

// Generic Get Entry by ID Method.
        public async Task<T> GetByIdAsync<T, TKey>(TKey id) where T : class where TKey : struct
        {
            // Check the type of id and call the appropriate FindAsync overload
            if (typeof(TKey) == typeof(int))
            {
                return await _appDbContext.Set<T>().FindAsync((int)(object)id);
            }
            else if (typeof(TKey) == typeof(Guid))
            {
                return await _appDbContext.Set<T>().FindAsync((Guid)(object)id);
            }
            else
            {
                throw new ArgumentException("Invalid id type");
            }
        }

// Generic Create Method.
        public async void Add<T>(T entity) where T : class
        {
           await _appDbContext.Set<T>().AddAsync(entity);
        }

// Generic Update Method.
        public async Task<T?> UpdateEntityAsync<T>(T entity, string primaryKeyPropertyName) where T : class
        {
            var primaryKeyProperty = typeof(T).GetProperty(primaryKeyPropertyName);

            if (primaryKeyProperty == null)
            {
                throw new ArgumentException($"The entity does not have a property named {primaryKeyPropertyName}.");
            }

            var entityId = primaryKeyProperty.GetValue(entity);

            if (entityId == null)
            {
                throw new ArgumentException("The entity Id cannot be null.");
            }

            var existingEntity = await _appDbContext.Set<T>().FindAsync(entityId);

            if (existingEntity != null)
            {
                _appDbContext.Entry(existingEntity).CurrentValues.SetValues(entity);
                await _appDbContext.SaveChangesAsync();
                return entity;
            }

            return null;
        }

// Generic Delete Method.
        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Set<T>().Remove(entity);
        }

// Save Database Method.
        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }

        public async void Attach<T>(T entity) where T : class
        {
            _appDbContext.Attach(entity);
        }
    }
}
