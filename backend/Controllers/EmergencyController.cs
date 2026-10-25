using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SathiCare.Api.Common;
using SathiCare.Api.Services;

namespace SathiCare.Api.Controllers;

[ApiController]
[Route("api/emergency")]
[Authorize]
public class EmergencyController : ControllerBase
{
    private readonly IEmergencyService _emergency;

    public EmergencyController(IEmergencyService emergency) => _emergency = emergency;

    [HttpGet("contacts")]
    public async Task<IActionResult> Contacts() =>
        Ok(ApiResult.Ok(new { contacts = await _emergency.GetContactsAsync(User.UserId()) }));

    public record AddContactRequest(string Name, string Phone, string? Relation);
    public record SosRequest(double? Latitude, double? Longitude, string? LocationLabel, string? Message);

    [HttpPost("contacts")]
    public async Task<IActionResult> AddContact([FromBody] AddContactRequest request) =>
        StatusCode(201, ApiResult.Ok(new { contacts = await _emergency.AddContactAsync(User.UserId(), request.Name, request.Phone, request.Relation) }, "Contact added"));

    [HttpDelete("contacts/{contactId:guid}")]
    public async Task<IActionResult> RemoveContact(Guid contactId)
    {
        await _emergency.RemoveContactAsync(User.UserId(), contactId);
        return Ok(ApiResult.Ok(null, "Contact removed"));
    }

    [HttpPost("sos")]
    public async Task<IActionResult> TriggerSos([FromBody] SosRequest? request) =>
        Ok(ApiResult.Ok(await _emergency.TriggerSosAsync(
            User.UserId(), request?.Latitude, request?.Longitude, request?.LocationLabel, request?.Message)));

    [HttpGet("alerts")]
    public async Task<IActionResult> Alerts() =>
        Ok(ApiResult.Ok(new { alerts = await _emergency.GetAlertsAsync(User.UserId()) }));
}
