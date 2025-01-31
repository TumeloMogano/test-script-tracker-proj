using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Repositories.Interface
{
    public interface ILookupRepository
    {
        Task<IEnumerable<Country>> GetAllCountriesAsync();
        Task<Country?> GetCountryById(int countryId);
        Task<Country> AddCountryAsync(Country country);
        Task<Country?> UpdateCountryAsync(Country country);
        Task DeleteCountryAsync(int countryId);

        Task<Region> AddRegionAsync(Region region);
        Task<IEnumerable<Region>> GetAllRegionsAsync();
        Task<Region?> GetRegionByIdAsync(int regionId);
        Task<Region?> UpdateRegionAsync(Region region);
        Task DeleteRegionAsync(int regionId);

        Task<City> AddCityAsync(City city);
        Task<IEnumerable<City>> GetAllCitiesAsync();
        Task<City?> GetCityByIdAsync(int cityId);
        Task<City?> UpdateCityAsync(City city);
        Task DeleteCityAsync(int cityId);

    }
}
