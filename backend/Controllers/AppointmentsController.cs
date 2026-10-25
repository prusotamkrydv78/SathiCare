using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SathiCare.Api.Common;
using SathiCare.Api.Services;

namespace SathiCare.Api.Controllers;

[ApiController]
[Route("api/appointments")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _appointments;

    public AppointmentsController(IAppointmentService appointments) => _appointments = appointments;

    public record BookRequest(Guid DoctorId, DateOnly Date, string Time, string Reason);
    public record RejectRequest(string? Reason);
    public record CompleteRequest(string Notes, string? Prescription);
    public record RateRequest(int Rating);

    // Doctor portal list must be registered before the "{id}" route.
    [HttpGet("doctor/mine")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> DoctorMine() =>
        Ok(ApiResult.Ok(new { appointments = await _appointments.DoctorMineAsync(User.UserId(), User.DoctorId() ?? Guid.Empty) }));

    [HttpGet("mine")]
    public async Task<IActionResult> Mine() =>
        Ok(ApiResult.Ok(new { appointments = await _appointments.MineAsync(User.UserId()) }));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id) =>
        Ok(ApiResult.Ok(await _appointments.GetByIdForUserAsync(User.SelfId(), id, User.Role() == "Doctor")));

    [HttpPost("book")]
    public async Task<IActionResult> Book([FromBody] BookRequest request) =>
        StatusCode(201, ApiResult.Ok(
            await _appointments.BookAsync(User.UserId(), request.DoctorId, request.Date, request.Time, request.Reason),
            "Request sent — the doctor will confirm shortly"));

    [HttpPut("{id:guid}/accept")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> Accept(Guid id) =>
        Ok(ApiResult.Ok(await _appointments.AcceptAsync(User.DoctorId() ?? Guid.Empty, id), "Appointment accepted"));

    [HttpPut("{id:guid}/reject")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> Reject(Guid id, [FromBody] RejectRequest? request) =>
        Ok(ApiResult.Ok(await _appointments.RejectAsync(User.DoctorId() ?? Guid.Empty, id, request?.Reason), "Appointment declined"));

    [HttpPut("{id:guid}/complete")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> Complete(Guid id, [FromBody] CompleteRequest request) =>
        Ok(ApiResult.Ok(await _appointments.CompleteAsync(User.DoctorId() ?? Guid.Empty, id, request.Notes, request.Prescription), "Consultation completed"));

    [HttpPut("{id:guid}/cancel")]
    public async Task<IActionResult> Cancel(Guid id) =>
        Ok(ApiResult.Ok(await _appointments.CancelAsync(User.UserId(), id), "Appointment cancelled"));

    [HttpPost("{id:guid}/rate")]
    public async Task<IActionResult> Rate(Guid id, [FromBody] RateRequest request) =>
        Ok(ApiResult.Ok(await _appointments.RateAsync(User.UserId(), id, request.Rating), "Thanks for your rating"));
}
