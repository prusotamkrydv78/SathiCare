using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SathiCare.Api.Common;
using SathiCare.Api.Services;

namespace SathiCare.Api.Controllers;

[ApiController]
[Route("api/pregnancy")]
[Authorize]
public class PregnancyController : ControllerBase
{
    private readonly IPregnancyService _pregnancy;

    public PregnancyController(IPregnancyService pregnancy) => _pregnancy = pregnancy;

    [HttpGet("current")]
    public async Task<IActionResult> Current() =>
        Ok(ApiResult.Ok(await _pregnancy.GetCurrentAsync(User.UserId())));

    [HttpGet("insights")]
    public async Task<IActionResult> Insights() =>
        Ok(ApiResult.Ok(await _pregnancy.GetInsightsAsync(User.UserId())));

    [HttpGet("logs")]
    public async Task<IActionResult> Logs() =>
        Ok(ApiResult.Ok(new { logs = await _pregnancy.GetLogsAsync(User.UserId()) }));

    public record StartRequest(DateOnly LmpDate, string? Notes);
    public record LogRequest(string LogType, string? Value, string? Notes);

    [HttpPost("start")]
    public async Task<IActionResult> Start([FromBody] StartRequest request) =>
        StatusCode(201, ApiResult.Ok(await _pregnancy.StartAsync(User.UserId(), request.LmpDate, request.Notes), "Pregnancy tracking started"));

    [HttpPost("end")]
    public async Task<IActionResult> End() =>
        Ok(ApiResult.Ok(await _pregnancy.EndAsync(User.UserId()), "Pregnancy tracking ended"));

    [HttpPost("log")]
    public async Task<IActionResult> Log([FromBody] LogRequest request) =>
        StatusCode(201, ApiResult.Ok(await _pregnancy.AddLogAsync(User.UserId(), request.LogType, request.Value, request.Notes), "Log saved"));
}
