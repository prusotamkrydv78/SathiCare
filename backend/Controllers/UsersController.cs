using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SathiCare.Api.Common;
using SathiCare.Api.Dtos;
using SathiCare.Api.Repositories;

namespace SathiCare.Api.Controllers;

[ApiController]
[Route("api/user")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public UsersController(IUnitOfWork uow) => _uow = uow;

    [HttpGet("profile")]
    public async Task<IActionResult> Profile()
    {
        var user = await _uow.Users.GetByIdAsync(User.UserId()) ?? throw ApiException.NotFound("Account not found.");
        return Ok(ApiResult.Ok(new
        {
            user = UserDto.From(user),
            healthProfile = string.IsNullOrEmpty(user.HealthProfileJson)
                ? null
                : JsonSerializer.Deserialize<object>(user.HealthProfileJson)
        }));
    }

    public record UpdateProfileRequest(string? Name, string? Phone, string? Language);

    [HttpPut("profile")]
    public async Task<IActionResult> Update([FromBody] UpdateProfileRequest request)
    {
        var user = await _uow.Users.GetByIdAsync(User.UserId()) ?? throw ApiException.NotFound("Account not found.");
        if (!string.IsNullOrWhiteSpace(request.Name)) user.Name = request.Name.Trim();
        if (request.Phone != null) user.Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();
        if (!string.IsNullOrWhiteSpace(request.Language)) user.Language = request.Language.Trim();
        user.UpdatedAt = DateTime.UtcNow;
        _uow.Users.Update(user);
        await _uow.SaveChangesAsync();
        return Ok(ApiResult.Ok(UserDto.From(user), "Profile updated"));
    }

    public record HealthProfileRequest(int? Age, string? BloodGroup, double? HeightCm, double? WeightKg,
        List<string>? Conditions, List<string>? Allergies, string? LastPeriodDate, string? Notes);

    [HttpPut("health-profile")]
    public async Task<IActionResult> UpdateHealth([FromBody] HealthProfileRequest request)
    {
        var user = await _uow.Users.GetByIdAsync(User.UserId()) ?? throw ApiException.NotFound("Account not found.");
        var payload = JsonSerializer.Serialize(new Dictionary<string, object?>
        {
            ["age"] = request.Age,
            ["bloodGroup"] = request.BloodGroup,
            ["heightCm"] = request.HeightCm,
            ["weightKg"] = request.WeightKg,
            ["conditions"] = request.Conditions ?? new List<string>(),
            ["allergies"] = request.Allergies ?? new List<string>(),
            ["lastPeriodDate"] = request.LastPeriodDate,
            ["notes"] = request.Notes
        }, new JsonSerializerOptions { DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull });
        user.HealthProfileJson = payload;
        user.UpdatedAt = DateTime.UtcNow;
        _uow.Users.Update(user);
        await _uow.SaveChangesAsync();
        return Ok(ApiResult.Ok(null, "Health details saved"));
    }

    [HttpDelete("account")]
    public async Task<IActionResult> DeleteAccount()
    {
        var user = await _uow.Users.GetByIdAsync(User.UserId()) ?? throw ApiException.NotFound("Account not found.");

        var cycles = await _uow.PeriodCycles.ListAsync(x => x.UserId == user.Id);
        _uow.PeriodCycles.RemoveRange(cycles.Select(c => _uow.PeriodCycles.GetByIdAsync(c.Id).Result).Where(c => c != null)!);
        var pregnancies = await _uow.Pregnancies.ListAsync(x => x.UserId == user.Id);
        _uow.Pregnancies.RemoveRange(pregnancies.Select(p => _uow.Pregnancies.GetByIdAsync(p.Id).Result).Where(p => p != null)!);
        var notifications = await _uow.Notifications.ListAsync(n => n.UserId == user.Id);
        _uow.Notifications.RemoveRange(notifications.Select(n => _uow.Notifications.GetByIdAsync(n.Id).Result).Where(n => n != null)!);
        var contacts = await _uow.EmergencyContacts.ListAsync(c => c.UserId == user.Id);
        _uow.EmergencyContacts.RemoveRange(contacts.Select(c => _uow.EmergencyContacts.GetByIdAsync(c.Id).Result).Where(c => c != null)!);

        _uow.Users.Remove(user);
        await _uow.SaveChangesAsync();
        return Ok(ApiResult.Ok(null, "Account deleted. Take care."));
    }
}
