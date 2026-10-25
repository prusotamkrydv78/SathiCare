using SathiCare.Api.Common;
using SathiCare.Api.Models;
using SathiCare.Api.Repositories;

namespace SathiCare.Api.Services;

public interface IFacilityService
{
    Task<List<object>> SearchAsync(double? latitude, double? longitude, string? search, string? type);
    Task<object> GetAsync(string facilityId, Guid? userId);
    Task<List<object>> ReviewsAsync(string facilityId);
    Task<object> AddReviewAsync(Guid userId, string facilityId, int rating, string? comment);
}

public class FacilityService : IFacilityService
{
    private readonly IUnitOfWork _uow;

    public FacilityService(IUnitOfWork uow) => _uow = uow;

    private const double EarthRadiusKm = 6371.0;
    private static double DistanceKm(double lat1, double lon1, double lat2, double lon2)
    {
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        return EarthRadiusKm * 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
    }

    public async Task<List<object>> SearchAsync(double? latitude, double? longitude, string? search, string? type)
    {
        var facilities = await _uow.Facilities.ListAsync(_ => true);
        var q = (search ?? "").Trim().ToLowerInvariant();
        var ids = facilities.Select(f => f.Id).ToList();
        var reviews = await _uow.Reviews.ListAsync(r => ids.Contains(r.FacilityId));

        var filtered = facilities.Where(f =>
            (string.IsNullOrEmpty(q) || f.Name.ToLowerInvariant().Contains(q) ||
             (f.Address ?? "").ToLowerInvariant().Contains(q) || f.Type.ToLowerInvariant().Contains(q)) &&
            (string.IsNullOrEmpty(type) || type == "all" || f.Type.Equals(type, StringComparison.OrdinalIgnoreCase)));

        // Default reference point: Janakpur (the app's home city)
        var lat = latitude ?? 26.7285;
        var lon = longitude ?? 85.9265;

        return filtered
            .Select(f => new
            {
                f.Id, f.Name, f.Type, f.Latitude, f.Longitude, f.Address, f.Phone, f.Hours,
                distanceKm = Math.Round(DistanceKm(lat, lon, f.Latitude, f.Longitude), 1),
                rating = reviews.Where(r => r.FacilityId == f.Id).Select(r => (double?)r.Rating).DefaultIfEmpty().Average() ?? 0,
                reviewCount = reviews.Count(r => r.FacilityId == f.Id)
            })
            .OrderBy(f => f.distanceKm)
            .Select(f => (object)f)
            .ToList();
    }

    public async Task<object> GetAsync(string facilityId, Guid? userId)
    {
        var f = await _uow.Facilities.GetByIdAsync(facilityId)
                ?? throw ApiException.NotFound("Facility not found.");
        var reviews = await _uow.Reviews.ListAsync(r => r.FacilityId == facilityId);
        return new
        {
            f.Id, f.Name, f.Type, f.Latitude, f.Longitude, f.Address, f.Phone, f.Hours,
            emergency = f.EmergencyServices,
            rating = reviews.Select(r => (double?)r.Rating).DefaultIfEmpty().Average() ?? 0,
            reviewCount = reviews.Count,
            hasReviewed = userId is { } u && reviews.Any(r => r.UserId == u)
        };
    }

    public async Task<List<object>> ReviewsAsync(string facilityId)
    {
        _ = await _uow.Facilities.GetByIdAsync(facilityId)
            ?? throw ApiException.NotFound("Facility not found.");
        var reviews = await _uow.Reviews.ListAsync(r => r.FacilityId == facilityId);
        return reviews.OrderByDescending(r => r.CreatedAt)
            .Select(r => (object)new { r.Id, r.UserName, r.Rating, r.Comment, createdAt = r.CreatedAt })
            .ToList();
    }

    public async Task<object> AddReviewAsync(Guid userId, string facilityId, int rating, string? comment)
    {
        if (rating is < 1 or > 5) throw ApiException.BadRequest("Rating must be 1 to 5.");
        _ = await _uow.Facilities.GetByIdAsync(facilityId)
            ?? throw ApiException.NotFound("Facility not found.");
        if (await _uow.Reviews.AnyAsync(r => r.FacilityId == facilityId && r.UserId == userId))
            throw ApiException.Conflict("You have already reviewed this facility.");

        var user = await _uow.Users.GetByIdAsync(userId);
        var review = new Review
        {
            FacilityId = facilityId,
            UserId = userId,
            UserName = user?.Name ?? "Anonymous",
            Rating = rating,
            Comment = comment?.Trim()
        };
        await _uow.Reviews.AddAsync(review);
        await _uow.SaveChangesAsync();
        return new { review.Id, review.UserName, review.Rating, review.Comment, createdAt = review.CreatedAt };
    }
}
