using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SathiCare.Api.Common;
using SathiCare.Api.Services;

namespace SathiCare.Api.Controllers;

[ApiController]
[Route("api/period")]
[Authorize]
public class PeriodController : ControllerBase
{
    private readonly IPeriodService _period;

    public PeriodController(IPeriodService period) => _period = period;

    [HttpGet("current")]
    public async Task<IActionResult> Current()
    {
        var data = await _period.GetCurrentAsync(User.UserId());
        return Ok(ApiResult.Ok(data));
    }

    [HttpGet("stats")]
    public async Task<IActionResult> Stats()
    {
        var data = await _period.GetStatsAsync(User.UserId());
        return Ok(ApiResult.Ok(data));
    }

    [HttpGet("history")]
    public async Task<IActionResult> History()
    {
        var data = await _period.GetHistoryAsync(User.UserId());
        return Ok(ApiResult.Ok(new { cycles = data }));
    }

    [HttpGet("predict")]
    public async Task<IActionResult> Predict()
    {
        var data = await _period.PredictAsync(User.UserId());
        return Ok(ApiResult.Ok(data));
    }

    public record StartRequest(string FlowLevel, int PainLevel, string? Notes);
    public record LogRequest(List<string> Symptoms, string? Mood, string? Notes);

    [HttpPost("start")]
    public async Task<IActionResult> Start([FromBody] StartRequest request)
    {
        var data = await _period.StartCycleAsync(User.UserId(), request.FlowLevel ?? "medium", request.PainLevel, request.Notes);
        return StatusCode(201, ApiResult.Ok(data, "Period logged"));
    }

    [HttpPost("end")]
    public async Task<IActionResult> End()
    {
        var data = await _period.EndCycleAsync(User.UserId());
        return Ok(ApiResult.Ok(data, "Period ended"));
    }

    [HttpPost("log")]
    public async Task<IActionResult> Log([FromBody] LogRequest request)
    {
        var data = await _period.AddLogAsync(User.UserId(), request.Symptoms ?? new(), request.Mood, request.Notes);
        return StatusCode(201, ApiResult.Ok(data, "Daily log saved"));
    }
}
