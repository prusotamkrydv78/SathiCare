using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SathiCare.Api.Common;
using SathiCare.Api.Services;

namespace SathiCare.Api.Controllers;

[ApiController]
[Route("api/consultations")]
[Authorize]
public class ConsultationsController : ControllerBase
{
    private readonly IConsultationService _consultations;

    public ConsultationsController(IConsultationService consultations) => _consultations = consultations;

    [HttpGet("{appointmentId:guid}/messages")]
    public async Task<IActionResult> Messages(Guid appointmentId) =>
        Ok(ApiResult.Ok(new
        {
            messages = await _consultations.GetMessagesAsync(User.SelfId(), User.Role() == "Doctor", appointmentId)
        }));
}
