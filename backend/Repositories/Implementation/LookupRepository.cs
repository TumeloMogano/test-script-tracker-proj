using Microsoft.EntityFrameworkCore;
using SkiaSharp;
using System.Diagnostics.Metrics;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Repositories.Interface;

namespace TestScriptTracker.Repositories.Implementation
{
    public class LookupRepository : ILookupRepository
    {
        private readonly AppDbContext context;

        public LookupRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<City> AddCityAsync(City city)
        {
            context.Cities.Add(city);
            await context.SaveChangesAsync();
            return city;
        }
        public async Task<Country> AddCountryAsync(Country country)
        {
            context.Countries.Add(country);
            await context.SaveChangesAsync();
            return country;
        }
        public async Task<Region> AddRegionAsync(Region region)
        {
            context.Regions.Add(region);
            await context.SaveChangesAsync();
            return region;
        }

        public async Task DeleteCityAsync(int cityId)
        {
            var city = await context.Cities.FindAsync(cityId);
            if (city != null)
            {
                context.Cities.Remove(city);
                await context.SaveChangesAsync();
            }
        }

        public async Task DeleteCountryAsync(int countryId)
        {
            var country = await context.Countries.FindAsync(countryId);
            if (country != null)
            {
                context.Countries.Remove(country);
                await context.SaveChangesAsync();
            }
        }

        public async Task DeleteRegionAsync(int regionId)
        {
            var region = await context.Regions.FindAsync(regionId);
            if (region != null)
            {
                context.Regions.Remove(region);
                await context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<City>> GetAllCitiesAsync()
        {
            return await context.Cities.ToListAsync();
        }
        public async Task<IEnumerable<Country>> GetAllCountriesAsync()
        {
            return await context.Countries.ToListAsync();
        }
        public async Task<IEnumerable<Region>> GetAllRegionsAsync()
        {
            return await context.Regions.ToListAsync();
        }

        public async Task<City?> GetCityByIdAsync(int cityId)
        {
            return await context.Cities.FindAsync(cityId);
        }
        public async Task<Country?> GetCountryById(int countryId)
        {
            return await context.Countries.FindAsync(countryId);
        }
        public async Task<Region?> GetRegionByIdAsync(int regionId)
        {
            return await context.Regions.FindAsync(regionId);
        }

        public async Task<City?> UpdateCityAsync(City city)
        {
            context.Cities.Update(city);
            await context.SaveChangesAsync();
            return city;
        }
        public async Task<Country?> UpdateCountryAsync(Country country)
        {
            var existingCountry = await context.Countries.FindAsync(country.CountryId);
            if (existingCountry != null)
            {
                existingCountry.CountryName = country.CountryName;
                await context.SaveChangesAsync();
                return existingCountry;
            }
            return null;
        }

        public async Task<Region?> UpdateRegionAsync(Region region)
        {
            context.Regions.Update(region);
            await context.SaveChangesAsync();
            return region;
        }
    }
}
