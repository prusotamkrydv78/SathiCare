using System.ComponentModel.DataAnnotations;
using SathiCare.Api.Models;

namespace SathiCare.Api.Dtos;

// ---------- Auth ----------
public record SignupRequest(
    [Required, MaxLength(120)] string Name,
    [Required, EmailAddress, MaxLength(256)] string Email,
    [Required, MinLength(6), MaxLength(100)] string Password,
    string? Phone,
    string? Language);

public record LoginRequest([Required, EmailAddress] string Email, [Required] string Password);

public record UserDto(Guid Id, string Name, string Email, string? Phone, string Role, Guid? DoctorId,
    string Language, string? AvatarUrl, DateTime CreatedAt)
{
    public static UserDto From(User u) =>
        new(u.Id, u.Name, u.Email, u.Phone, u.Role.ToString().ToLowerInvariant(), u.DoctorId, u.Language, u.AvatarUrl, u.CreatedAt);
}

// ---------- Demo ----------
public record DemoAccountDto(string Label, string Email, string Role);

public record DemoAccountsDto(string Password, List<DemoAccountDto> Accounts);
