using System.Security.Claims;

namespace SathiCare.Api.Common;

/// <summary>Consistent API envelope: { success, message, data } — same shape the old Node API used.</summary>
public static class ApiResult
{
    public static object Ok(object? data = null, string? message = null) =>
        new { success = true, message, data };

    public static object Error(string message) =>
        new { success = false, message };
}

/// <summary>Thrown by services/controllers; the middleware maps it to a JSON error with the right status code.</summary>
public class ApiException : Exception
{
    public int StatusCode { get; }

    public ApiException(int statusCode, string message) : base(message) =>
        StatusCode = statusCode;

    public static ApiException BadRequest(string message) => new(400, message);
    public static ApiException Unauthorized(string message) => new(401, message);
    public static ApiException Forbidden(string message) => new(403, message);
    public static ApiException NotFound(string message) => new(404, message);
    public static ApiException Conflict(string message) => new(409, message);
    public static ApiException TooMany(string message) => new(429, message);
}

public static class ClaimsPrincipalExtensions
{
    public static Guid UserId(this ClaimsPrincipal user)
    {
        var id = user.FindFirstValue(ClaimTypes.NameIdentifier)
                 ?? user.FindFirstValue("sub");
        return Guid.TryParse(id, out var g) ? g : Guid.Empty;
    }

    public static string? Role(this ClaimsPrincipal user) =>
        user.FindFirstValue(ClaimTypes.Role) ?? user.FindFirstValue("role");

    public static Guid? DoctorId(this ClaimsPrincipal user)
    {
        var id = user.FindFirstValue("doctorId");
        return Guid.TryParse(id, out var g) ? g : null;
    }

    public static Guid SelfId(this ClaimsPrincipal user) =>
        user.Role() == "Doctor" && user.DoctorId() is { } d ? d : user.UserId();
}
