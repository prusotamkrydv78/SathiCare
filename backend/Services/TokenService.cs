using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using SathiCare.Api.Models;

namespace SathiCare.Api.Services;

public interface ITokenService
{
    string CreateAccessToken(User user);
    string CreateRefreshToken();
    DateTime RefreshTokenExpiry();
}

public class TokenService : ITokenService
{
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config) => _config = config;

    public string CreateAccessToken(User user)
    {
        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
            _config["Jwt:Key"] ?? "sathicare-demo-access-secret-change-me-please-32"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Name, user.Name),
            new(ClaimTypes.Role, user.Role.ToString()),
            new("role", user.Role.ToString())
        };
        if (user.DoctorId is { } docId)
        {
            claims.Add(new Claim("doctorId", docId.ToString()));
        }

        var expires = DateTime.UtcNow.AddDays(double.TryParse(_config["Jwt:AccessDays"], out var d) ? d : 7);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"] ?? "sathicare-api",
            audience: _config["Jwt:Audience"] ?? "sathicare-client",
            claims: claims,
            expires: expires,
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string CreateRefreshToken() =>
        Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

    public DateTime RefreshTokenExpiry() =>
        DateTime.UtcNow.AddDays(double.TryParse(_config["Jwt:RefreshDays"], out var d) ? d : 30);
}
