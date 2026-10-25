using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SathiCare.Api.Common;
using SathiCare.Api.Services;

namespace SathiCare.Api.Controllers;

[ApiController]
[Route("api/health")]
[Authorize]
public class HealthController : ControllerBase
{
    private readonly IHealthService _health;

    public HealthController(IHealthService health) => _health = health;

    public record ChatRequest(Guid? ChatId, string Message);
    public record SymptomsRequest(List<string> Symptoms, string? Notes);

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request) =>
        Ok(ApiResult.Ok(await _health.ChatAsync(User.UserId(), request.ChatId, request.Message)));

    [HttpGet("chats")]
    public async Task<IActionResult> Chats() =>
        Ok(ApiResult.Ok(new { chats = await _health.GetChatsAsync(User.UserId()) }));

    [HttpGet("chat/{chatId:guid}")]
    public async Task<IActionResult> Messages(Guid chatId) =>
        Ok(ApiResult.Ok(new { messages = await _health.GetMessagesAsync(User.UserId(), chatId) }));

    [HttpDelete("chat/{chatId:guid}")]
    public async Task<IActionResult> DeleteChat(Guid chatId)
    {
        await _health.DeleteChatAsync(User.UserId(), chatId);
        return Ok(ApiResult.Ok(null, "Chat deleted"));
    }

    [HttpPost("symptoms")]
    public async Task<IActionResult> Symptoms([FromBody] SymptomsRequest request) =>
        Ok(ApiResult.Ok(await _health.AnalyzeSymptomsAsync(User.UserId(), request.Symptoms ?? new(), request.Notes)));

    [HttpGet("tip")]
    public async Task<IActionResult> Tip() =>
        Ok(ApiResult.Ok(await _health.DailyTipAsync()));
}
