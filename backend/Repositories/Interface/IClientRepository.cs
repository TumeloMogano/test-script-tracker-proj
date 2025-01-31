using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Repositories.Interface
{
    public interface IClientRepository
    {
        Task<Theme> CreateTheme(Theme theme);

        Task<Logo> CreateLogo(Logo logo);

        Task<ColourScheme> CreateColourScheme(ColourScheme colourScheme);

        Task<Theme[]> GetClientThemes(Guid clientId);

        Task<Logo[]> GetClientThemeLogos(Guid themeId);

        Task<IEnumerable<Logo>> GetThemeLogosAsync(Guid themeId);

        Task<ColourScheme[]> GetClientThemeColourSchemes(Guid themeId);

        Task<IEnumerable<ColourScheme>> GetThemeColourSchemeAsync(Guid themeId);

        Task<Theme> GetThemeById(Guid themeId);

        Task<Logo> GetLogoById(Guid logoId);
        Task<Logo?> GetLogoByClient(Guid clientId);

        Task<ColourScheme> GetColourSchemeById(Guid csId);

        void Delete<T>(T entity) where T : class;

        Task<bool> SaveChangesAsync();

        Task<Font[]> GetAllFontsAsync();
        Task<Font> GetFontById(int fontId);

        Task<Theme> DeleteTheme(Guid themeId);
        Task<Client> CreateClientAsync(Client client);
        Task<IEnumerable<Client>> GetAllClientsAsync();
        Task<Client?> GetClientByIdAsync(Guid clientid);
        Task<IEnumerable<Client?>> GetClientsByCityAsync(int cityid);
        Task<IEnumerable<Client?>> GetClientsByRegionAsync(int regionid);
        Task<IEnumerable<Client?>> GetClientsByCountryAsync(int countryid);
        Task<Client?> UpdateClientAsync(Client client);
        Task<Client?> DeleteClientAsync(Guid clientid);
        Task<bool> HasDependenciesAsync(Guid clientid);
        Task<bool> DeleteClientsAsync(Guid clientid);

        Task<ClientRepresentative> CreateClientRep(ClientRepresentative clientrep);
        Task<IEnumerable<ClientRepresentative>> GetAllClientRepsAsync();
        Task<ClientRepresentative?> GetClientRepByIdAsync(Guid clientrepid);
        Task<IEnumerable<ClientRepresentative?>> GetRepsByClientAsync(Guid clientId);
        Task<ClientRepresentative?> UpdateClientRepAsync(ClientRepresentative clientrep);
        Task<ClientRepresentative?> DeleteClientRepAsync(Guid clientrepid);
        Task<IEnumerable<City>> GetAllCitiesAsync();
        Task<IEnumerable<Country>> GetAllCountries();
        Task<IEnumerable<Region>> GetAllRegions();
        Task<IEnumerable<City?>> GetCitiesByCountryAsync(int countryid);
        Task<IEnumerable<Region?>> GetRegionsByCountryAsync(int countryid);
        Task<IEnumerable<City?>> GetCitiesByRegionAsync(int regionid);

    }
}
