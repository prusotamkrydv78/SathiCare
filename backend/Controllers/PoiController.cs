using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SathiCare.Api.Common;
using SathiCare.Api.Services;

namespace SathiCare.Api.Controllers;

[ApiController]
[Route("api/poi")]
public class PoiController : ControllerBase
{
    private readonly IFacilityService _facilities;

    public PoiController(IFacilityService facilities) => _facilities = facilities;

    [HttpGet("nearby")]
    public async Task<IActionResult> Nearby([FromQuery] double? latitude, [FromQuery] double? longitude,
        [FromQuery] string? search, [FromQuery] string? type) =>
        Ok(ApiResult.Ok(new { facilities = await _facilities.SearchAsync(latitude, longitude, search, type) }));

    [HttpGet("{facilityId}")]
    public async Task<IActionResult> Details(string facilityId)
    {
        var userId = User.Identity?.IsAuthenticated == true ? User.UserId() : (Guid?)null;
        return Ok(ApiResult.Ok(await _facilities.GetAsync(facilityId, userId)));
    }

    [HttpGet("{facilityId}/reviews")]
    public async Task<IActionResult> Reviews(string facilityId) =>
        Ok(ApiResult.Ok(new { reviews = await _facilities.ReviewsAsync(facilityId) }));

    public record ReviewRequest(int Rating, string? Comment);

    [HttpPost("{facilityId}/reviews")]
    [Authorize]
    public async Task<IActionResult> AddReview(string facilityId, [FromBody] ReviewRequest request) =>
        StatusCode(201, ApiResult.Ok(await _facilities.AddReviewAsync(User.UserId(), facilityId, request.Rating, request.Comment), "Thank you for your review"));
}
