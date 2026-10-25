using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SathiCare.Api.Common;
using SathiCare.Api.Services;

namespace SathiCare.Api.Controllers;

[ApiController]
[Route("api/doctors")]
public class DoctorsController : ControllerBase
{
    private readonly IAppointmentService _appointments;

    public DoctorsController(IAppointmentService appointments) => _appointments = appointments;

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? search, [FromQuery] string? specialization) =>
        Ok(ApiResult.Ok(new { doctors = await _appointments.ListDoctorsAsync(search, specialization) }));

    [HttpGet("{doctorId:guid}")]
    public async Task<IActionResult> Get(Guid doctorId) =>
        Ok(ApiResult.Ok(await _appointments.GetDoctorAsync(doctorId)));

    [HttpGet("{doctorId:guid}/availability")]
    public async Task<IActionResult> Availability(Guid doctorId, [FromQuery] DateOnly date) =>
        Ok(ApiResult.Ok(await _appointments.GetAvailabilityAsync(doctorId, date)));
}
