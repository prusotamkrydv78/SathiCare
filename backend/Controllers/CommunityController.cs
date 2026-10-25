using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SathiCare.Api.Common;
using SathiCare.Api.Services;

namespace SathiCare.Api.Controllers;

[ApiController]
[Route("api/community")]
public class CommunityController : ControllerBase
{
    private readonly ICommunityService _community;

    public CommunityController(ICommunityService community) => _community = community;

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? category, [FromQuery] string sort = "new", [FromQuery] int page = 1, [FromQuery] int limit = 20)
    {
        var userId = User.Identity?.IsAuthenticated == true ? User.UserId() : (Guid?)null;
        return Ok(ApiResult.Ok(await _community.ListPostsAsync(userId, category, sort, Math.Max(page, 1), Math.Clamp(limit, 1, 50))));
    }

    [HttpGet("{postId:guid}")]
    public async Task<IActionResult> Get(Guid postId)
    {
        var userId = User.Identity?.IsAuthenticated == true ? User.UserId() : (Guid?)null;
        return Ok(ApiResult.Ok(await _community.GetPostAsync(userId, postId)));
    }

    public record CreatePostRequest(string? Title, string Content, string? Category, bool Anonymous);
    public record CommentRequest(string Content);
    public record ReportRequest(string Reason);

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreatePostRequest request) =>
        StatusCode(201, ApiResult.Ok(await _community.CreatePostAsync(User.UserId(), request.Title ?? "", request.Content, request.Category ?? "general", request.Anonymous), "Post shared"));

    [HttpPost("{postId:guid}/like")]
    [Authorize]
    public async Task<IActionResult> Like(Guid postId) =>
        Ok(ApiResult.Ok(await _community.ToggleLikeAsync(User.UserId(), postId)));

    [HttpPost("{postId:guid}/comments")]
    [Authorize]
    public async Task<IActionResult> Comment(Guid postId, [FromBody] CommentRequest request) =>
        StatusCode(201, ApiResult.Ok(await _community.AddCommentAsync(User.UserId(), postId, request.Content), "Comment added"));

    [HttpPost("{postId:guid}/report")]
    [Authorize]
    public async Task<IActionResult> Report(Guid postId, [FromBody] ReportRequest request)
    {
        await _community.ReportAsync(User.UserId(), postId, request.Reason);
        return Ok(ApiResult.Ok(null, "Reported — our team will review it"));
    }
}
