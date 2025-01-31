using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.ViewModel;
using TestScriptTracker.Repositories.Implementation;
using TestScriptTracker.Repositories.Interface;
using TestScriptTracker.Models.CombinedModels;
using TestScriptTracker.Models.DTO;
using Azure.Core;
using SkiaSharp;


namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly IClientRepository _clientRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly ITeamRepository _teamRepository;

        public ClientsController(IClientRepository clientRepository, ITeamRepository teamRepository, IProjectRepository projectRepository)
        {
            _clientRepository = clientRepository;
            _teamRepository = teamRepository;
            _projectRepository = projectRepository;
        }

        [HttpPost]
        [Route("CreateTheme/{clientId}")]
        public async Task<IActionResult> CreateTheme(Guid clientId, ClientThemeRequest request)
        {
            try
            {
                var newTheme = new Theme
                {
                    ThemeName = request.Theme.ThemeName,
                    FontSize = request.Theme.FontSize,
                    ClientId = clientId,
                    FontId = request.Theme.FontId,
                };

                await _clientRepository.CreateTheme(newTheme);
                var addedTheme = newTheme;

                var newLogo = new Logo
                {
                    LogoImage = request.Logo.LogoImage,
                    ThemeId = addedTheme.ThemeId,
                };
                await _clientRepository.CreateLogo(newLogo);

                var newColourScheme = new ColourScheme
                {
                    Colour = request.ColourScheme.Colour,
                    ThemeId = addedTheme.ThemeId,
                };
                await _clientRepository.CreateColourScheme(newColourScheme);

                //MIGHT NOT NEED THIS
                var response = new ClientThemeResponse
                {
                    Theme = addedTheme,
                    Logo = newLogo,
                    ColourScheme = newColourScheme
                };

                return Ok(response);
                //return Ok("Theme created successfully");

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        
        [HttpPost]
        [Route("AddLogo/{themeId}")]
        public async Task<IActionResult> AddLogo(Guid themeId, LogoViewModel logoModel)
        {
            try
            {
                var newLogo = new Logo
                {
                    LogoImage = logoModel.LogoImage,
                    ThemeId = themeId,
                };
                await _clientRepository.CreateLogo(newLogo);

                var getLogo = new LogoDto
                {
                    LogoId = newLogo.LogoId,
                    LogoImage = newLogo.LogoImage,
                    ThemeId = newLogo.ThemeId
                };

                return Ok(getLogo);

                //return Ok(newLogo);
                //return Ok("Logo created successfully");
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpPost]
        [Route("AddColorScheme/{themeId}")]
        public async Task<IActionResult> AddColourScheme(Guid themeId, ColourSchemeViewModel CSModel)
        {
            try
            {
                var newColourScheme = new ColourScheme
                {
                    Colour = CSModel.Colour,
                    ThemeId = themeId,
                };
                await _clientRepository.CreateColourScheme(newColourScheme);

                var getCS = new ColourSchemeDto
                {
                    ColourSchemeId = newColourScheme.ColourSchemeId,
                    Colour = newColourScheme.Colour,
                    ThemeId = newColourScheme.ThemeId
                };

                return Ok(getCS);
                //return Ok(newColourScheme);
                //return Ok("Colour Scheme created successfully");
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpGet]
        [Route("GetClientThemes/{clientId}")]
        public async Task<IActionResult> GetClientThemes(Guid clientId)
        {
            try
            {
                var themes = await _clientRepository.GetClientThemes(clientId);

                var clientThemes = new List<ThemeDto>();
                foreach (var theme in themes)
                {
                    clientThemes.Add(new ThemeDto
                    {
                        ClientId = theme.ClientId,
                        ThemeId = theme.ThemeId,
                        ThemeName = theme.ThemeName,
                        FontSize = theme.FontSize,
                        FontId = theme.FontId,
                    });
                }
                return Ok(clientThemes);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetThemeLogos/{themeId}")]
        public async Task<IActionResult> GetThemeLogos(Guid themeId)
        {
            try
            {
                var logos = await _clientRepository.GetClientThemeLogos(themeId);

                var themeLogos = new List<LogoDto>();
                foreach (var logo in logos)
                {
                    themeLogos.Add(new LogoDto
                    {
                        LogoId = logo.LogoId,
                        LogoImage = logo.LogoImage,
                        ThemeId = logo.ThemeId,
                    });
                }
                return Ok(themeLogos);
                //return Ok(logos);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetThemeColourSchemes/{themeId}")]
        public async Task<IActionResult> GetThemeColourSchemes(Guid themeId)
        {
            try
            {
                var colourSchemes = await _clientRepository.GetClientThemeColourSchemes(themeId);

                var themeCS = new List<ColourSchemeDto>();
                foreach (var cs in colourSchemes)
                {
                    themeCS.Add(new ColourSchemeDto
                    {
                        ColourSchemeId = cs.ColourSchemeId,
                        Colour = cs.Colour,
                        ThemeId = cs.ThemeId,
                    });
                }
                return Ok(themeCS);
                //return Ok(colourSchemes);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetThemeById/{themeId}")]
        public async Task<IActionResult> GetThemeById(Guid themeId)
        {
            try
            {
                var existingTheme = await _clientRepository.GetThemeById(themeId);

                var theme = new ThemeDto
                {
                    ClientId = existingTheme.ClientId,
                    ThemeId = existingTheme.ThemeId,
                    ThemeName = existingTheme.ThemeName,
                    FontSize = existingTheme.FontSize,
                    FontId = existingTheme.FontId,
                };

                var logos = await _clientRepository.GetThemeLogosAsync(themeId);
                var colourSchemes = await _clientRepository.GetThemeColourSchemeAsync(themeId);

                var themeDetails = new ThemeDetails
                {
                    Theme = theme,
                    ThemeLogos = logos.ToList(),
                    ThemeColourSchemes = colourSchemes.ToList()
                };

                return Ok(themeDetails);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpGet]
        [Route("GetThemeFullById/{themeId}")]
        public async Task<IActionResult> GetThemeFullById(Guid themeId)
        {
            try
            {
                var existingTheme = await _clientRepository.GetThemeById(themeId);

                var theme = new ThemeDto
                {
                    ClientId = existingTheme.ClientId,
                    ThemeId = existingTheme.ThemeId,
                    ThemeName = existingTheme.ThemeName,
                    FontSize = existingTheme.FontSize,
                    FontId = existingTheme.FontId,
                };

                return Ok(theme);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetLogoById/{logoId}")]
        public async Task<IActionResult> GetLogoById(Guid logoId)
        {
            try
            {
                var existingLogo = await _clientRepository.GetLogoById(logoId);

                if (existingLogo == null)
                { return StatusCode(404, "Not Found"); }

                var getLogo = new LogoDto
                {
                    LogoId = existingLogo.LogoId,
                    LogoImage = existingLogo.LogoImage,
                    ThemeId = existingLogo.ThemeId
                };

                return Ok(getLogo);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetLogoByClient/{clientid:Guid}")]
        public async Task<IActionResult> GetLogoByClient([FromRoute] Guid clientid)
        {           

            try
            {
                var logo = await _clientRepository.GetLogoByClient(clientid);

                if (logo == null)
                {
                    return NotFound("logo not found");
                }

                return Ok(logo);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }

        }

        [HttpGet]
        [Route("GetColourSchemeById/{csId}")]
        public async Task<IActionResult> GetColourSchemeById(Guid csId)
        {
            try
            {
                var existingCS = await _clientRepository.GetColourSchemeById(csId);

                if (existingCS == null)
                { return StatusCode(404, "Not Found"); }

                var getCS = new ColourSchemeDto
                {
                    ColourSchemeId = existingCS.ColourSchemeId,
                    Colour = existingCS.Colour,
                    ThemeId = existingCS.ThemeId
                };

                return Ok(getCS);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");

            }
        }

        [HttpPut]
        [Route("UpdateTheme/{themeId}")]
        public async Task<ActionResult<ThemeDto>> UpdateTheme(Guid themeId, UpdateThemeDto model)
        {
            try
            {
                var existingTheme = await _clientRepository.GetThemeById(themeId);

                if (existingTheme == null)
                    return StatusCode(404, "Not Found, the requested theme does not exist");
                else
                {
                    existingTheme.ThemeName = model.ThemeName;
                    existingTheme.FontSize = model.FontSize;
                    existingTheme.ClientId = existingTheme.ClientId;
                    existingTheme.FontId = model.FontId;
                }

                if (await _clientRepository.SaveChangesAsync())
                { return Ok(existingTheme); }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
            return StatusCode(400, "Bad Request, your request is invalid!");
        }

        [HttpPut]
        [Route("UpdateLogo/{logoId}")]
        public async Task<ActionResult<LogoDto>> UpdateLogo(Guid logoId, LogoDto logoModel)
        {
            try
            {
                var result = await _clientRepository.GetLogoById(logoId);

                if (result == null)
                    return StatusCode(404, "Not Found, the requested logo does not exist");
                else
                {
                    result.LogoImage = logoModel.LogoImage;
                }
                if (await _clientRepository.SaveChangesAsync())
                { return Ok(result); }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
            return StatusCode(400, "Bad Request, your request is invalid!");
        }

        [HttpPut]
        [Route("UpdateColourScheme/{csId}")]
        public async Task<ActionResult<ColourSchemeDto>> UpdateColourScheme(Guid csId, ColourSchemeDto CSModel)
        {
            try
            {
                var result = await _clientRepository.GetColourSchemeById(csId);

                if (result == null)
                    return StatusCode(404, "Not Found, the requested colour scheme does not exist");
                else
                {
                    result.Colour = CSModel.Colour;
                }
                if (await _clientRepository.SaveChangesAsync())
                { return Ok(result); }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
            return StatusCode(400, "Bad Request, your request is invalid!");
        }

        [HttpDelete]
        [Route("RemoveTheme/{themeId}")]

        public async Task<IActionResult> RemoveTheme(Guid themeId)
        {
            try
            {
                var result = await _clientRepository.GetThemeById(themeId);

                if (result == null)
                    return StatusCode(404, "Not Found, the requested theme does not exist");
                else
                {
                    await _clientRepository.DeleteTheme(themeId);
                }

                if (await _clientRepository.SaveChangesAsync())
                {
                    var getTheme = new ThemeDto
                    {
                        ThemeName = result.ThemeName,
                        ThemeId = result.ThemeId,
                        FontId = result.FontId,
                        ClientId = result.ClientId,
                        FontSize = result.FontSize
                    };

                    return Ok(getTheme);
                    //return Ok(result);
                    //return Ok("Theme deleted successfully.");
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return StatusCode(400, "Bad Request, your request is invalid!");
        }

        [HttpDelete]
        [Route("RemoveLogo/{logoId}")]

        public async Task<IActionResult> RemoveLogo(Guid logoId)
        {
            try
            {
                var result = await _clientRepository.GetLogoById(logoId);

                if (result == null)
                    return StatusCode(404, "Not Found, the requested logo does not exist");
                else
                {
                    _clientRepository.Delete(result);
                }

                if (await _clientRepository.SaveChangesAsync())
                {
                    var getLogo = new LogoDto
                    {
                        LogoId = result.LogoId,
                        LogoImage = result.LogoImage,
                        ThemeId = result.ThemeId
                    };

                    return Ok(getLogo);
                    //return Ok(result);
                    //return Ok("Logo deleted successfully.");
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return StatusCode(400, "Bad Request, your request is invalid!");
        }


        [HttpDelete]
        [Route("RemoveColourScheme/{csId}")]
        public async Task<IActionResult> RemoveColourScheme(Guid csId)
        {
            try
            {
                var existingCS = await _clientRepository.GetColourSchemeById(csId);

                if (existingCS == null)
                    return StatusCode(404, "Not Found, the requested colour scheme does not exist");
                else
                {
                    _clientRepository.Delete(existingCS);
                }

                if (await _clientRepository.SaveChangesAsync())
                {
                    var getCS = new ColourSchemeDto
                    {
                        ColourSchemeId = existingCS.ColourSchemeId,
                        Colour = existingCS.Colour,
                        ThemeId = existingCS.ThemeId
                    };

                    return Ok(getCS);
                    //return Ok(result);
                    //return Ok("Colour Scheme deleted successfully.");
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return StatusCode(400, "Bad Request, your request is invalid!");
        }

        [HttpGet]
        [Route("GetAllFonts")]
        public async Task<IActionResult> GetAllFonts()
        {
            try
            {
                //Retrieve list from repository
                var fonts = await _clientRepository.GetAllFontsAsync();

                //Map domain model to dto using list retrieved from the repository
                var response = new List<FontDto>();
                foreach (var font in fonts)
                {
                    response.Add(new FontDto
                    {
                        FontId = font.FontId,
                        FontName = font.FontName
                    });
                }
                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }

        }

        [HttpGet]
        [Route("GetFontById/{fontId}")]
        public async Task<IActionResult> GetFontById(int fontId)
        {
            try
            {
                var existingFont = await _clientRepository.GetFontById(fontId);

                if (existingFont == null)
                { return StatusCode(404, "Not Found"); }

                //var getFont = new FontDto
                //{
                //    FontId = existingFont.FontId,
                //    FontName = existingFont.FontName,
                //};

                return Ok(existingFont);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");

            }
        }

        [HttpGet]
        [Route("GetCFullById/{colourId}")]
        public async Task<IActionResult> GetCFullById(Guid colourId)
        {
            try
            {
                var Colour = await _clientRepository.GetColourSchemeById(colourId);

                if (Colour == null)
                { return StatusCode(404, "Not Found"); }

                //var getFont = new FontDto
                //{
                //    FontId = existingFont.FontId,
                //    FontName = existingFont.FontName,
                //};

                return Ok(Colour);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");

            }
        }
        //Client & Client Rep Methods/Endpoints

        [HttpGet]
        [Route("GetAllCountries")]
        public async Task<IActionResult> GetAllCountries()
        {
            try
            { 
            
                var countries = await _clientRepository.GetAllCountries();

                if (countries == null)
                {
                    return NoContent();
                }

                var country = new List<CountryDto>();
                foreach (var i in countries)
                {
                    country.Add(new CountryDto
                    {
                        CountryId = i.CountryId,
                        CountryName = i.CountryName
                    });
                }

                return Ok(country);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpGet]
        [Route("GetAllRegions")]
        public async Task<IActionResult> GetAllRegions()
        {
            try
            {
                var regions = await _clientRepository.GetAllRegions();

                if (regions == null)
                {
                    return NoContent();
                }

                return Ok(regions);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpGet]
        [Route("GetAllCities/")]
        public async Task<IActionResult> GetAllCities()
        {
            try
            {
                var cities = await _clientRepository.GetAllCitiesAsync();

                var response = new List<CityDto>();
                foreach (var city in cities)
                {
                    response.Add(new CityDto
                    {
                        CityId = city.CityId,
                        CityName = city.CityName
                    });
                }

                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }

        }

        [HttpGet]
        [Route("GetAllClients")]//Tested
        public async Task<IActionResult> GetAllClients()
        {

            try
            {
                //Retrieve list from repository
                var clients = await _clientRepository.GetAllClientsAsync();

                //Map domain model to dto using list retrieved from the repository
                var response = new List<ClientDto>();
                foreach (var client in clients)
                {
                    response.Add(new ClientDto
                    {
                        ClientId = client.ClientId,
                        ClientName = client.ClientName,
                        ClientEmail = client.ClientEmail,
                        ClientNumber = client.ClientNumber,
                        ClientRegistrationNr = client.ClientRegistrationNr,
                        AddressStreetNumber = client.AddressStreetNumber,
                        AddressStreetName = client.AddressStreetName,
                        PostalCode = client.PostalCode,
                        CityId = client.CityId,
                        CityName = client.City.CityName,
                        Region = client.City.Regions.RegionName,
                        Country = client.City.Regions.Country.CountryName
                    });
                }
                return Ok(response);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpGet]
        [Route("GetClientById/{clientid:Guid}")]//Tested
        public async Task<IActionResult> GetClientById([FromRoute] Guid clientid)
        {
            try
            {
                var existingclient = await _clientRepository.GetClientByIdAsync(clientid);

                if (existingclient == null)
                {
                    return NotFound();
                }

                var response = new ClientDto
                {
                    ClientId = clientid,
                    ClientName = existingclient.ClientName,
                    ClientEmail = existingclient.ClientEmail,
                    ClientNumber = existingclient.ClientNumber,
                    ClientRegistrationNr = existingclient.ClientRegistrationNr,
                    AddressStreetNumber = existingclient.AddressStreetNumber,
                    AddressStreetName = existingclient.AddressStreetName,
                    PostalCode = existingclient.PostalCode,
                    CityId = existingclient.CityId,
                    CityName = existingclient.City.CityName,
                    Region = existingclient.City.Regions.RegionName,
                    Country = existingclient.City.Regions.Country.CountryName

                };

                return Ok(response);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }

        }

        [HttpPost]
        [Route("CreateClient")]//Tested
        public async Task<IActionResult> CreateClient(ClientViewModel clientmodel)
        {
            try
            {
                var query = new Client
                {
                    ClientName = clientmodel.ClientName,
                    ClientEmail = clientmodel.ClientEmail,
                    ClientNumber = clientmodel.ClientNumber,
                    ClientRegistrationNr = clientmodel.ClientRegistrationNr,
                    AddressStreetNumber = clientmodel.AddressStreetNumber,
                    AddressStreetName = clientmodel.AddressStreetName,
                    PostalCode = clientmodel.PostalCode,
                    CreationDate = DateTime.Now,
                    CityId = clientmodel.CityId

                };

                await _clientRepository.CreateClientAsync(query);

                return Ok(query);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");

            }
        }

        [HttpPut]
        [Route("UpdateClient/{clientid:Guid}")]//Tested
        public async Task<IActionResult> UpdateClient([FromRoute] Guid clientid, ClientViewModel clientmodel)
        {
            try
            {
                var client = new Client
                {
                    ClientId = clientid,
                    ClientName = clientmodel.ClientName,
                    ClientEmail = clientmodel.ClientEmail,
                    ClientNumber = clientmodel.ClientNumber,
                    ClientRegistrationNr = clientmodel.ClientRegistrationNr,
                    AddressStreetNumber = clientmodel.AddressStreetNumber,
                    AddressStreetName = clientmodel.AddressStreetName,
                    PostalCode = clientmodel.PostalCode,
                    CityId = clientmodel.CityId
                };

                client = await _clientRepository.UpdateClientAsync(client);

                if (client == null)
                {
                    return NotFound();
                }

                var response = new ClientDto
                {
                    ClientId = client.ClientId,
                    ClientName = clientmodel.ClientName,
                    ClientEmail = clientmodel.ClientEmail,
                    ClientNumber = clientmodel.ClientNumber,
                    ClientRegistrationNr = clientmodel.ClientRegistrationNr,
                    AddressStreetNumber = clientmodel.AddressStreetNumber,
                    AddressStreetName = clientmodel.AddressStreetName,
                    PostalCode = clientmodel.PostalCode,
                    CityId = clientmodel.CityId,
                    CityName = "",
                    Region = "",
                    Country = ""


                };

                return Ok(response);

            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please Contact Support.");
            }
        }

        [HttpDelete]
        [Route("RemoveClient/{clientid:Guid}")]//Tested
        public async Task<IActionResult> DeleteClient([FromRoute] Guid clientid)
        {
            try
            {
                if (await _clientRepository.HasDependenciesAsync(clientid))
                {
                    return BadRequest(new { message = "Cannot delete the client because it has dependent entities." });
                }

                var result = await _clientRepository.DeleteClientsAsync(clientid);

                if (!result)
                {
                    return NotFound(new { message = "Client not found." });
                }

                return Ok(new { message = "Client deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }

            //var existingClient = await _clientRepository.DeleteClientAsync(clientid);

            ////Check if a team has been found/ is NOT null
            //if (existingClient is null)
            //{
            //    return NotFound();
            //}

            ////Convert//map Domain model to DTO
            //var response = new ClientDto
            //{
            //    ClientId = existingClient.ClientId,
            //    ClientName = existingClient.ClientName,
            //    ClientEmail = existingClient.ClientEmail,
            //    ClientNumber = existingClient.ClientNumber,
            //    ClientRegistrationNr = existingClient.ClientRegistrationNr,
            //    AddressStreetNumber = existingClient.AddressStreetNumber,
            //    AddressStreetName = existingClient.AddressStreetName,
            //    PostalCode = existingClient.PostalCode,
            //    CityId = existingClient.CityId
            //};

            //return Ok(response);
        }




        [HttpGet]
        [Route("GetClientsByCity/{cityid:int}")]
        public async Task<IActionResult> GetClientsByCity([FromRoute] int cityid)
        {
            try
            {

                var clients = await _clientRepository.GetClientsByCityAsync(cityid);

                if (clients == null)
                {
                    return NotFound();
                }

                var clientsCity = new List<ClientDto>();
                foreach (var client in clients)
                {
                    clientsCity.Add(new ClientDto
                    {
                        ClientId = client.ClientId,
                        ClientName = client.ClientName,
                        ClientEmail = client.ClientEmail,
                        ClientNumber = client.ClientNumber,
                        ClientRegistrationNr = client.ClientRegistrationNr,
                        AddressStreetNumber = client.AddressStreetNumber,
                        AddressStreetName = client.AddressStreetName,
                        PostalCode = client.PostalCode,
                        CityId = client.CityId,
                        CityName = client.City.CityName,
                        Region = client.City.Regions.RegionName,
                        Country = client.City.Regions.Country.CountryName
                    });
                }



                return Ok(clientsCity);


            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpGet]
        [Route("GetClientsByRegion/{regionid:int}")]
        public async Task<IActionResult> GetClientsByRegion([FromRoute] int regionid)
        {
            try
            {
                var clients = await _clientRepository.GetClientsByRegionAsync(regionid);

                if (clients == null)
                {
                    return NotFound();
                }

                var clientsRegion = new List<ClientDto>();
                foreach (var client in clients)
                {
                    clientsRegion.Add(new ClientDto
                    {
                        ClientId = client.ClientId,
                        ClientName = client.ClientName,
                        ClientEmail = client.ClientEmail,
                        ClientNumber = client.ClientNumber,
                        ClientRegistrationNr = client.ClientNumber,
                        AddressStreetNumber = client.AddressStreetNumber,
                        AddressStreetName = client.AddressStreetName,
                        PostalCode = client.PostalCode,
                        CityId = client.CityId,
                        CityName = client.City.CityName,
                        RegionId = client.City.Regions.RegionId,
                        Region = client.City.Regions.RegionName,
                        CountryId = client.City.Regions.Country.CountryId,
                        Country = client.City.Regions.Country.CountryName
                    });
                }

                return Ok(clientsRegion);

            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpGet]
        [Route("GetClientsByCountry/{countryid:int}")]
        public async Task<IActionResult> GetClientsByCountry([FromRoute] int countryid)
        {
            try
            {
                var clients = await _clientRepository.GetClientsByCountryAsync(countryid);

                if (clients == null)
                {
                    return NotFound();
                }

                var clientsCountry = new List<ClientDto>();
                foreach (var client in clients)
                {
                    clientsCountry.Add(new ClientDto
                    {
                        ClientId = client.ClientId,
                        ClientName = client.ClientName,
                        ClientEmail = client.ClientEmail,
                        ClientNumber = client.ClientNumber,
                        ClientRegistrationNr = client.ClientNumber,
                        AddressStreetNumber = client.AddressStreetNumber,
                        AddressStreetName = client.AddressStreetName,
                        PostalCode = client.PostalCode,
                        CityId = client.CityId,
                        CityName = client.City.CityName,
                        RegionId = client.City.Regions.RegionId,
                        Region = client.City.Regions.RegionName,
                        CountryId = client.City.Regions.Country.CountryId,
                        Country = client.City.Regions.Country.CountryName
                    });
                }

                return Ok(clientsCountry);

            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpGet]
        [Route("GetCitiesByCountry/{countryid:int}")]
        public async Task<IActionResult> GetCitiesByCountry([FromRoute] int countryid)
        {
            try
            {
                var existingcities = await _clientRepository.GetCitiesByCountryAsync(countryid);

                if (existingcities == null)
                {
                    return NotFound();
                }

                var city = new List<CityDto>();
                foreach (var c in existingcities)
                {
                    city.Add(new CityDto
                    {
                        CityId = c.CityId,
                        CityName = c.CityName
                    });
                }

                return Ok(city);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpGet]
        [Route("GetRegionsByCountry/{countryid:int}")]
        public async Task<IActionResult> GetRegionsByCountry([FromRoute] int countryid)
        {
            try
            {
                var regions = await _clientRepository.GetRegionsByCountryAsync(countryid);

                if (regions == null)
                {
                    return NotFound();
                }

                var reg = new List<RegionDto>();
                foreach (var region in regions)
                {
                    reg.Add(new RegionDto
                    {
                        RegionId = region.RegionId,
                        RegionName = region.RegionName
                    });
                }

                return Ok(reg);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet]
        [Route("GetCitiesByRegion/{regionid:int}")]
        public async Task<IActionResult> GetCitiesByRegion([FromRoute] int regionid)
        {
            try
            {
                var cities = await _clientRepository.GetCitiesByRegionAsync(regionid);

                if (cities == null)
                {
                    return NotFound();
                }

                var city = new List<CityDto>();
                foreach (var c in cities)
                {
                    city.Add(new CityDto
                    {
                        CityId = c.CityId,
                        CityName = c.CityName
                    });
                }

                return Ok(city);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }



        [HttpPost]
        [Route("CreateClientRep")]//Tested
        public async Task<IActionResult> CreateClientRep(ClientRepViewModel repmodel)
        {
            try
            {
                var query = new ClientRepresentative
                {
                    RepName = repmodel.RepName,
                    RepSurname = repmodel.RepSurname,
                    RepIDNumber = repmodel.RepIDNumber,
                    RepContactNumber = repmodel.RepContactNumber,
                    RepEmailAddress = repmodel.RepEmailAddress,
                    ClientId = repmodel.ClientId,
                    //UserId = repmodel.UserId
                };

                await _clientRepository.CreateClientRep(query);

                return Ok(query);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }

        }

        [HttpGet]
        [Route("GetRepsByClientId/{clientid:Guid}")]
        public async Task<IActionResult> GetClientRepsByClient([FromRoute] Guid clientid)
        {
            try
            {
                var clientReps = await _clientRepository.GetRepsByClientAsync(clientid);

                if(clientReps == null)
                {
                    return NotFound();
                }

                var reps = new List<ClientRepDto>();
                foreach(var clientRep in clientReps)
                {
                    reps.Add(new ClientRepDto
                    { 
                        ClientRepId = clientRep.ClientRepId,
                        RepName = clientRep.RepName,
                        RepSurname = clientRep.RepSurname,
                        RepContactNumber = clientRep.RepContactNumber,
                        RepEmailAddress = clientRep.RepEmailAddress,
                        RepIDNumber = clientRep.RepIDNumber,
                        ClientId = clientRep.ClientId,
                        ClientName = clientRep.Client.ClientName
                        //UserId = clientRep.UserId
                    });
                }

                return Ok(reps);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpGet]
        [Route("GetAllClientReps")]//Tested
        public async Task<IActionResult> GetAllClientsReps()
        {
            try
            {
                //Retrieve list from repository
                var clientreps = await _clientRepository.GetAllClientRepsAsync();

                //Map domain model to dto using list retrieved from the repository
                var response = new List<ClientRepDto>();
                foreach (var rep in clientreps)
                {
                    response.Add(new ClientRepDto
                    {
                        ClientRepId = rep.ClientRepId,
                        RepName = rep.RepName,
                        RepSurname = rep.RepSurname,
                        RepIDNumber = rep.RepIDNumber,
                        RepContactNumber = rep.RepContactNumber,
                        RepEmailAddress = rep.RepEmailAddress,
                        ClientId = rep.ClientId,
                        ClientName = rep.Client.ClientName,
                        //UserId = rep.UserId,
                        
                    }) ;
                }
                return Ok(response);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpGet]
        [Route("GetClientRep/{clientrepid:Guid}")]//Tested
        public async Task<IActionResult> GetClientRepById([FromRoute] Guid clientrepid)
        {
            try
            {
                var existingclientrep = await _clientRepository.GetClientRepByIdAsync(clientrepid);

                if (existingclientrep == null)
                {
                    return NotFound();
                }

                var response = new ClientRepDto
                {
                    ClientRepId = clientrepid,
                    RepName = existingclientrep.RepName,
                    RepSurname = existingclientrep.RepSurname,
                    RepIDNumber = existingclientrep.RepIDNumber,
                    RepContactNumber = existingclientrep.RepContactNumber,
                    RepEmailAddress = existingclientrep.RepEmailAddress,
                    ClientId = existingclientrep.ClientId,
                    ClientName = existingclientrep.Client.ClientName
                    //UserId = existingclientrep.UserId

                };

                return Ok(response);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }

        }

        [HttpPut]
        [Route("UpdateClientRep/{clientrepid:Guid}")]//Tested
        public async Task<IActionResult> UpdateClientRep([FromRoute] Guid clientrepid, ClientRepViewModel model)
        {
            try
            {
                var clientrep = new ClientRepresentative
                {
                    ClientRepId = clientrepid,
                    RepName = model.RepName,
                    RepSurname = model.RepSurname,
                    RepIDNumber = model.RepIDNumber,
                    RepContactNumber = model.RepContactNumber,
                    RepEmailAddress = model.RepEmailAddress,
                    ClientId = model.ClientId,
                    //UserId = model.UserId
                };

                clientrep = await _clientRepository.UpdateClientRepAsync(clientrep);

                if (clientrep == null)
                {
                    return NotFound();
                }

                var response = new ClientRepDto
                {
                    ClientRepId = clientrep.ClientRepId,
                    RepName = clientrep.RepName,
                    RepSurname = clientrep.RepSurname,
                    RepIDNumber = clientrep.RepIDNumber,
                    RepContactNumber = clientrep.RepContactNumber,
                    RepEmailAddress = clientrep.RepEmailAddress,
                    ClientId = clientrep.ClientId,
                    ClientName = clientrep.Client?.ClientName,
                    UserId = clientrep.UserId
                    
                };

                return Ok(response);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        [HttpDelete]
        [Route("RemoveClientRep/{clientrepid:Guid}")]//Tested
        public async Task<IActionResult> DeleteClientRep([FromRoute] Guid clientrepid)
        {
            try
            {
                var existingClientRep = await _clientRepository.DeleteClientRepAsync(clientrepid);

                //Check if a team has been found/ is NOT null
                if (existingClientRep is null)
                {
                    return NotFound();
                }

                //Convert//map Domain model to DTO
                var response = new ClientRepDto
                {
                    ClientRepId = existingClientRep.ClientRepId,
                    RepName = existingClientRep.RepName,
                    RepSurname = existingClientRep.RepSurname,
                    RepIDNumber = existingClientRep.RepIDNumber,
                    RepContactNumber = existingClientRep.RepContactNumber,
                    RepEmailAddress = existingClientRep.RepEmailAddress,
                    ClientId = existingClientRep.ClientId,
                    //UserId = existingClientRep.UserId
                };

                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }

        


        [HttpGet("GetClientsFilteredForUserAccess/{userId}")]
        public async Task<IActionResult> GetClientsFilteredForUserAccess(Guid userId)
        {
            try
            {
                // Retrieve data from repositories
                var projects = await _projectRepository.GetAllProjectsAsync();
                var teams = await _teamRepository.GetAllTeamsAsync();
                var teamMembers = await _teamRepository.GetAllTeamsMembersAsync();
                var clients = await _clientRepository.GetAllClientsAsync();

                // Filter and join data
                var userTeams = teamMembers.Where(tm => tm.UserId == userId).Select(tm => tm.TeamId).ToList();
                var userProjects = projects.Where(p => userTeams.Contains(p.TeamId ?? Guid.Empty) && !p.IsDeleted).ToList();
                var userClientIds = userProjects.Select(p => p.ClientId).Distinct().ToList();
                var userClients = clients.Where(c => userClientIds.Contains(c.ClientId) && !c.IsDeleted).ToList();

                // Map domain model to DTO
                var response = userClients.Select(client => new ClientDto
                {
                    ClientId = client.ClientId,
                    ClientName = client.ClientName,
                    ClientEmail = client.ClientEmail,
                    ClientNumber = client.ClientNumber,
                    ClientRegistrationNr = client.ClientRegistrationNr,
                    AddressStreetNumber = client.AddressStreetNumber,
                    AddressStreetName = client.AddressStreetName,
                    PostalCode = client.PostalCode,
                    CityId = client.CityId,
                    CityName = client.City.CityName,
                    Region = client.City.Regions.RegionName,
                    Country = client.City.Regions.Country.CountryName
                }).ToList();

                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please Contact Support");
            }
        }


    }
}
