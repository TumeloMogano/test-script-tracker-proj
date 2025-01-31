using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TestScriptTracker.Factory;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Repositories.Interface;
using TestScriptTracker.Shared.Authorization;

namespace TestScriptTracker.Repositories.Implementation
{
    public class TokenRepository : ITokenRepository
    {
        private readonly IConfiguration configuration;
        private readonly AppUserClaimsPrincipalFactory claimsPrincipalFactory;

        public TokenRepository(IConfiguration configuration,
            AppUserClaimsPrincipalFactory claimsPrincipalFactory)
        {
            this.configuration = configuration;
            this.claimsPrincipalFactory = claimsPrincipalFactory;
        }
        public async Task<string> CreateJwtToken(AppUser user)
        {
            var claimsPrincipal = await claimsPrincipalFactory.CreateAsync(user);

            //Create Claims
            //var claims = claimsPrincipal.Claims.ToList();

            var claims = claimsPrincipal.Claims.Select(c => new Claim(MapClaimType(
                c.Type), c.Value)).ToList();

            //Jwt Security Token Parameters
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Tokens:Key"]!));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: configuration["Tokens:Issuer"],
                audience: configuration["Tokens:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: credentials);

            //Return Token
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string MapClaimType(string claimType)
        {
            return claimType switch
            {
                ClaimTypes.NameIdentifier => "nameid",
                ClaimTypes.Name => "name",
                ClaimTypes.Email => "email",
                ClaimTypes.Surname => "surname",
                "AspNet.Identity.SecurityStamp" => "securityStamp",
                ClaimTypes.Role => "roles",
                CustomClaimTypes.Permissions => "Permissions",
                _ => claimType
            };
        }
    }
}
