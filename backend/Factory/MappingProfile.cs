using AutoMapper;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.DTO;

namespace TestScriptTracker.Factory
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Country, CountryLDto>().ReverseMap();
            CreateMap<Region, RegionLDto>().ReverseMap();
            CreateMap<City, CityLDto>().ReverseMap();
        }
    }
}
