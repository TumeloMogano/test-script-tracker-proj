using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Repositories.Interface;
using System;
using Microsoft.AspNetCore.Http.HttpResults;

namespace TestScriptTracker.Repositories.Implementation
{
    public class ClientRepository : IClientRepository
    {
        private readonly AppDbContext dbContext;

        public ClientRepository(AppDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        public async Task<Theme> CreateTheme(Theme theme)
        {
            await dbContext.Themes.AddAsync(theme);
            await dbContext.SaveChangesAsync();

            return theme;
        }

        public async Task<Logo> CreateLogo(Logo logo)
        {
            await dbContext.Logos.AddAsync(logo);
            await dbContext.SaveChangesAsync();

            return logo;
        }

        public async Task<ColourScheme> CreateColourScheme(ColourScheme colourScheme)
        {
            await dbContext.ColourSchemes.AddAsync(colourScheme);
            await dbContext.SaveChangesAsync();

            return colourScheme;
        }

        public async Task<Theme[]> GetClientThemes(Guid clientId)
        {
            IQueryable<Theme> query = dbContext.Themes.Where(c => c.ClientId == clientId);
            return await query.ToArrayAsync();
        }

        public async Task<Logo[]> GetClientThemeLogos(Guid themeId)
        {
            IQueryable<Logo> query = dbContext.Logos.Where(t => t.ThemeId == themeId);
            return await query.ToArrayAsync();
        }

        public async Task<IEnumerable<Logo>> GetThemeLogosAsync(Guid themeId)
        {
            //IQueryable<Logo> query = dbContext.Logo.Where(t => t.ThemeId == themeId);
            //return await query.ToListAsync();
            return await dbContext.Logos.Where(t => t.ThemeId == themeId).ToListAsync();
        }

        public async Task<ColourScheme[]> GetClientThemeColourSchemes(Guid themeId)
        {
            IQueryable<ColourScheme> query = dbContext.ColourSchemes.Where(t => t.ThemeId == themeId);
            return await query.ToArrayAsync();
        }

        public async Task<IEnumerable<ColourScheme>> GetThemeColourSchemeAsync(Guid themeId)
        {
            //IQueryable<ColourScheme> query = dbContext.ColourScheme.Where(t => t.ThemeId == themeId);
            //return await query.ToListAsync();
            return await dbContext.ColourSchemes.Where(t => t.ThemeId == themeId).ToListAsync();
        }

        public async Task<Theme> GetThemeById(Guid themeId)
        {
            IQueryable<Theme> query = dbContext.Themes.Where(c => c.ThemeId == themeId);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Logo> GetLogoById(Guid logoId)
        {
            IQueryable<Logo> query = dbContext.Logos.Where(t => t.LogoId == logoId);
            return await query.FirstOrDefaultAsync();
        }
        

        public async Task<ColourScheme> GetColourSchemeById(Guid csId)
        {
            IQueryable<ColourScheme> query = dbContext.ColourSchemes.Where(t => t.ColourSchemeId == csId);
            return await query.FirstOrDefaultAsync();
        }

        public void Delete<T>(T entity) where T : class
        {
            dbContext.Remove(entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await dbContext.SaveChangesAsync() > 0;
        }

        public async Task<Font[]> GetAllFontsAsync()
        {
            IQueryable<Font> query = dbContext.Fonts;
            return await query.ToArrayAsync();
        }
        public async Task<Font> GetFontById(int fontId)
        {
            IQueryable<Font> query = dbContext.Fonts.Where(t => t.FontId == fontId);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Theme> DeleteTheme(Guid themeId)
        {
            var theme = dbContext.Themes.Include(l => l.Logos).Include(c => c.ColourSchemes).FirstOrDefault(t => t.ThemeId == themeId);
            dbContext.Logos.RemoveRange(theme.Logos);
            dbContext.ColourSchemes.RemoveRange(theme.ColourSchemes);
            dbContext.Themes.Remove(theme);

            return theme;
        }

        public async Task<Client> CreateClientAsync(Client client)
        {
            await dbContext.Clients.AddAsync(client);
            await dbContext.SaveChangesAsync();


            return client;
        }

        public async Task<IEnumerable<Client>> GetAllClientsAsync()
        {
             return await dbContext.Clients
              .Include(x => x.City)
                  .ThenInclude(x => x.Regions)
                      .ThenInclude(x => x.Country)
                      .Where(x => x.City != null && x.City.Regions != null && x.City.Regions != null)
                      .AsNoTracking()
                      .ToListAsync();
        }

        public async Task<Client?> GetClientByIdAsync(Guid clientid)
        {
            var existingClient = await dbContext.Clients
                .Include(t => t.City.Regions.Country).FirstOrDefaultAsync(x => x.ClientId == clientid);

            if (existingClient == null)
            {
                return null;
            }

            return existingClient;
        }

        public async Task<Client?> UpdateClientAsync(Client client)
        {
            var existingClient = await dbContext.Clients.FirstOrDefaultAsync(x => x.ClientId == client.ClientId);

            if (existingClient != null)
            {
                dbContext.Entry(existingClient).CurrentValues.SetValues(client);
                await dbContext.SaveChangesAsync();
                return client;
            }

            return null;
        }

        public async Task<Client?> DeleteClientAsync(Guid clientid)
        {
            var existingClient = await dbContext
           .Clients.Include(x => x.ClientRepresentatives)
           .Where(x => x.ClientId == clientid).Include(x => x.Projects)
           .Where(x => x.ClientId == clientid).Include(x => x.Themes)
           .Where(x => x.ClientId == clientid).FirstOrDefaultAsync(x => x.ClientId == clientid);

            if (existingClient is null)
            {
                return null;
            }

            dbContext.Clients.Remove(existingClient);
            await dbContext.SaveChangesAsync();
            return existingClient;
        }
        public async Task<IEnumerable<ClientRepresentative>> GetAllClientRepsAsync()
        {
            return await dbContext.ClientRepresentatives
                .Include(z => z.Client).Include(z => z.User)                
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<ClientRepresentative> CreateClientRep(ClientRepresentative clientrep)
        {
            await dbContext.ClientRepresentatives.AddAsync(clientrep);
            await dbContext.SaveChangesAsync();

            return clientrep;
        }

        public async Task<ClientRepresentative?> GetClientRepByIdAsync(Guid clientrepid)
        {
            var existingClientRep = await dbContext.ClientRepresentatives
                 .Include(k => k.Client).FirstOrDefaultAsync(x => x.ClientRepId == clientrepid);

            if (existingClientRep == null)
            {
                return null;
            }

            return existingClientRep;
        }

        public async Task<ClientRepresentative?> UpdateClientRepAsync(ClientRepresentative clientrep)
        {
            var existingClientRep = await dbContext.ClientRepresentatives.Include(x => x.Client).Include(x => x.User)
                .FirstOrDefaultAsync(x => x.ClientRepId == clientrep.ClientRepId);

            if (existingClientRep != null)
            {
                dbContext.Entry(existingClientRep).CurrentValues.SetValues(clientrep);
                await dbContext.SaveChangesAsync();
                return clientrep;
            }

            return null;
        }

        public async Task<ClientRepresentative?> DeleteClientRepAsync(Guid clientrepid)
        {
            var existingClientRep = await dbContext
                .ClientRepresentatives.FirstOrDefaultAsync(x => x.ClientRepId == clientrepid);

            if (existingClientRep is null)
            {
                return null;
            }

            dbContext.ClientRepresentatives.Remove(existingClientRep);
            await dbContext.SaveChangesAsync();
            return existingClientRep;
        }

        public async Task<IEnumerable<Client?>> GetClientsByCityAsync(int cityid)
        {
            var clients = await dbContext.Clients
                .Include(x => x.City).
                    ThenInclude(x => x.Regions).
                        ThenInclude(x => x.Country)
                            .Where(x => x.CityId ==cityid)
                            .ToListAsync();

            if (clients.Count == 0)
            {
                return null;
            }

            return clients;
        }

        public async Task<IEnumerable<Client?>> GetClientsByRegionAsync(int regionid)
        {
            var clients = await dbContext.Clients
                .Include(x => x.City)
                    .ThenInclude(x => x.Regions)
                        .ThenInclude(x => x.Country)
                            .Where(x => x.City.Regions.RegionId == regionid)
                            .ToListAsync();

            if (clients.Count == 0)
            {
                return null;
            }

            return clients;

        }

        public async Task<IEnumerable<Client?>> GetClientsByCountryAsync(int countryid)
        {
            var clients = await dbContext.Clients
                .Include(x => x.City)
                    .ThenInclude(x => x.Regions)
                        .ThenInclude(x => x.Country)
                            .Where(x => x.City.Regions.Country.CountryId == countryid)
                            .ToListAsync();

            if (clients == null)
            {
                return null;
            }

            return clients;
        }

        public async Task<IEnumerable<City>> GetAllCitiesAsync()
        {
            return await dbContext.Cities.ToListAsync();
        }

        public async Task<IEnumerable<Country>> GetAllCountries()
        {
            return await dbContext.Countries.ToListAsync();
        }

        public async Task<IEnumerable<Region>> GetAllRegions()
        {
            return await dbContext.Regions.ToListAsync();
        }

        public async Task<IEnumerable<ClientRepresentative?>> GetRepsByClientAsync(Guid clientId)
        {
            var reps = await dbContext.ClientRepresentatives
                .Include(x => x.Client)
                    .Where(x => x.Client.ClientId == clientId)
                    .ToListAsync();

            if (reps == null)
            {
                return null;
            }

            return reps;
        }

        public async Task<IEnumerable<City?>> GetCitiesByCountryAsync(int countryid)
        {
            var cities = await dbContext.Regions
                .Where(r => r.CountryId == countryid)
                .Include(r => r.Cities)
                .SelectMany(r => r.Cities)
                .ToListAsync();

            if (cities.Count == 0)
            {
                return null;
            }

            return cities;
        }

        public async Task<Logo?> GetLogoByClient(Guid clientId)
        {
            var logo = await dbContext.Themes
                .Where(x => x.ClientId == clientId)
                .SelectMany(x => x.Logos)
                .FirstOrDefaultAsync();

           return logo;

        }

        public async Task<IEnumerable<Region?>> GetRegionsByCountryAsync(int countryid)
        {
            var regions = await dbContext.Regions
                .Where(r => r.CountryId == countryid)
                .ToListAsync();

            if (regions.Count == 0)
            {
                return null;
            }

            return regions;
        }

        public async Task<IEnumerable<City?>> GetCitiesByRegionAsync(int regionid)
        {
            var cities = await dbContext.Cities
                .Where(r => r.RegionId == regionid)
                .ToListAsync();

            if (cities == null)
            {
                return null;
            }

            return cities;
        }

        public async Task<bool> HasDependenciesAsync(Guid clientid)
        {
            var hasDependencies = await dbContext.ClientRepresentatives.AnyAsync(ur => ur.ClientId == clientid) ||
                await dbContext.Projects.AnyAsync(rp => rp.ClientId == clientid) ||
                await dbContext.Themes.AnyAsync(t => t.ClientId == clientid);

            return hasDependencies;
        }

        public async Task<bool> DeleteClientsAsync(Guid clientid)
        {
            var client = await dbContext.Clients.FindAsync(clientid);

            if (client == null)
            {
                return false;
            }

            dbContext.Clients.Remove(client);
            await dbContext.SaveChangesAsync();
            return true;
        }
    }
}
