using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SathiCare.Api.Common;
using SathiCare.Api.Services;

namespace SathiCare.Api.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notifications;

    public NotificationsController(INotificationService notifications) => _notifications = notifications;

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] bool? unread, [FromQuery] int page = 1, [FromQuery] int limit = 20) =>
        Ok(ApiResult.Ok(new
        {
            notifications = await _notifications.ListAsync(User.UserId(), unread, Math.Max(page, 1), Math.Clamp(limit, 1, 50))
        }));

    [HttpGet("unread-count")]
    public async Task<IActionResult> UnreadCount() =>
        Ok(ApiResult.Ok(new { count = await _notifications.UnreadCountAsync(User.UserId()) }));

    [HttpPut("read-all")]
    public async Task<IActionResult> ReadAll()
    {
        await _notifications.MarkAllReadAsync(User.UserId());
        return Ok(ApiResult.Ok(null, "All marked as read"));
    }

    [HttpDelete("clear-all")]
    public async Task<IActionResult> ClearAll()
    {
        await _notifications.ClearAllAsync(User.UserId());
        return Ok(ApiResult.Ok(null, "Notifications cleared"));
    }

    // NOTE: specific-item routes are declared AFTER none; "/read-all" and "/clear-all"
    // are fixed segments so they can never collide with an id route.

    [HttpPut("{notificationId:guid}/read")]
    public async Task<IActionResult> MarkRead(Guid notificationId)
    {
        await _notifications.MarkReadAsync(User.UserId(), notificationId);
        return Ok(ApiResult.Ok(null, "Marked as read"));
    }
}
