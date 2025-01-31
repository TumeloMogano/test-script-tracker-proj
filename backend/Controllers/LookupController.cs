using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.DTO;
using TestScriptTracker.Repositories.Implementation;
using TestScriptTracker.Repositories.Interface;

namespace TestScriptTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LookupController : ControllerBase
    {
        private readonly ILookupRepository lookupRepository;

        public LookupController(ILookupRepository lookupRepository)
        {
            this.lookupRepository = lookupRepository;
        }

        [HttpGet("countries")]
        public async Task<IActionResult> GetAllCountries()
        {
            var countries = await lookupRepository.GetAllCountriesAsync();
            return Ok(countries);
        }

        [HttpGet("countries/{countryId}")]
        public async Task<IActionResult> GetCountryById(int countryId)
        {
            var country = await lookupRepository.GetCountryById(countryId);
            if (country == null)
            {
                return NotFound();
            }
            return Ok(country);
        }

        [HttpPost("countries")]
        public async Task<IActionResult> AddCountry([FromBody] CountryLDto createCountryDto)
        {
            var country = new Country
            {
                CountryName = createCountryDto.CountryName
            };

            await lookupRepository.AddCountryAsync(country);
            return CreatedAtAction(nameof(GetCountryById), new { countryId = country.CountryId }, country);
        }

        [HttpPut("countries/{countryId}")]
        public async Task<IActionResult> UpdateCountry(int countryId, [FromBody] CountryLDto updateCountryDto)
        {
            var country = await lookupRepository.GetCountryById(countryId);
            if (country == null)
            {
                return NotFound();
            }

            country.CountryName = updateCountryDto.CountryName;

            await lookupRepository.UpdateCountryAsync(country);
            return NoContent();
        }

        [HttpDelete("countries/{countryId}")]
        public async Task<IActionResult> DeleteCountry(int countryId)
        {
            var country = await lookupRepository.GetCountryById(countryId);
            if (country == null)
            {
                return NotFound();
            }

            await lookupRepository.DeleteCountryAsync(countryId);
            return NoContent();
        }


        [HttpGet("regions")]
        public async Task<IActionResult> GetAllRegions()
        {
            var regions = await lookupRepository.GetAllRegionsAsync();
            return Ok(regions);
        }

        [HttpGet("regions/{regionId}")]
        public async Task<IActionResult> GetRegionById(int regionId)
        {
            var region = await lookupRepository.GetRegionByIdAsync(regionId);
            if (region == null)
            {
                return NotFound();
            }
            return Ok(region);
        }

        [HttpPost("regions")]
        public async Task<IActionResult> AddRegion([FromBody] RegionLDto createRegionDto)
        {
            var region = new Region
            {
                RegionName = createRegionDto.RegionName,
                CountryId = createRegionDto.CountryId
            };

            await lookupRepository.AddRegionAsync(region);
            return CreatedAtAction(nameof(GetRegionById), new { regionId = region.RegionId }, region);
        }

        [HttpPut("regions/{regionId}")]
        public async Task<IActionResult> UpdateRegion(int regionId, [FromBody] RegionLDto updateRegionDto)
        {
            var region = await lookupRepository.GetRegionByIdAsync(regionId);
            if (region == null)
            {
                return NotFound();
            }

            region.RegionName = updateRegionDto.RegionName;
            region.CountryId = updateRegionDto.CountryId;

            await lookupRepository.UpdateRegionAsync(region);
            return NoContent();
        }

        [HttpDelete("regions/{regionId}")]
        public async Task<IActionResult> DeleteRegion(int regionId)
        {
            var region = await lookupRepository.GetRegionByIdAsync(regionId);
            if (region == null)
            {
                return NotFound();
            }

            await lookupRepository.DeleteRegionAsync(regionId);
            return NoContent();
        }


        [HttpGet("cities")]
        public async Task<IActionResult> GetAllCities()
        {
            var cities = await lookupRepository.GetAllCitiesAsync();
            return Ok(cities);
        }

        [HttpGet("cities/{cityId}")]
        public async Task<IActionResult> GetCityById(int cityId)
        {
            var city = await lookupRepository.GetCityByIdAsync(cityId);
            if (city == null)
            {
                return NotFound();
            }
            return Ok(city);
        }

        [HttpPost("cities")]
        public async Task<IActionResult> AddCity([FromBody] CityLDto createCityDto)
        {
            var city = new City
            {
                CityName = createCityDto.CityName,
                RegionId = createCityDto.RegionId
            };

            await lookupRepository.AddCityAsync(city);
            return CreatedAtAction(nameof(GetCityById), new { cityId = city.CityId }, city);
        }

        [HttpPut("cities/{cityId}")]
        public async Task<IActionResult> UpdateCity(int cityId, [FromBody] CityLDto updateCityDto)
        {
            var city = await lookupRepository.GetCityByIdAsync(cityId);
            if (city == null)
            {
                return NotFound();
            }

            city.CityName = updateCityDto.CityName;
            city.RegionId = updateCityDto.RegionId;

            await lookupRepository.UpdateCityAsync(city);
            return NoContent();
        }

        [HttpDelete("cities/{cityId}")]
        public async Task<IActionResult> DeleteCity(int cityId)
        {
            var city = await lookupRepository.GetCityByIdAsync(cityId);
            if (city == null)
            {
                return NotFound();
            }

            await lookupRepository.DeleteCityAsync(cityId);
            return NoContent();
        }

    }
}
