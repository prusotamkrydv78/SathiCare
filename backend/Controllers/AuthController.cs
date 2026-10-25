using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SathiCare.Api.Common;
using SathiCare.Api.Dtos;
using SathiCare.Api.Models;
using SathiCare.Api.Repositories;
using SathiCare.Api.Services;

namespace SathiCare.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    private readonly ITokenService _tokens;
    private readonly IUnitOfWork _uow;

    public AuthController(IAuthService auth, ITokenService tokens, IUnitOfWork uow)
    {
        _auth = auth;
        _tokens = tokens;
        _uow = uow;
    }

    private void SetAuthCookies(User user)
    {
        var secure = bool.TryParse(Configuration?["Cookies:Secure"], out var s) && s;
        var access = _tokens.CreateAccessToken(user);
        var refresh = _tokens.CreateRefreshToken();

        user.RefreshToken = refresh;
        user.RefreshTokenExpires = _tokens.RefreshTokenExpiry();
        _uow.Users.Update(user);

        Response.Cookies.Append("accessToken", access, new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.Lax,
            Secure = secure,
            Path = "/",
            MaxAge = TimeSpan.FromDays(7)
        });
        Response.Cookies.Append("refreshToken", refresh, new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.Lax,
            Secure = secure,
            Path = "/",
            MaxAge = TimeSpan.FromDays(30)
        });
    }

    private IConfiguration? Configuration => HttpContext.RequestServices.GetService<IConfiguration>();

    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] SignupRequest request)
    {
        var user = await _auth.SignupAsync(request);
        return StatusCode(201, ApiResult.Ok(user, "Account created successfully"));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _auth.LoginAsync(request);
        SetAuthCookies(user);
        await _uow.SaveChangesAsync();
        return Ok(ApiResult.Ok(UserDto.From(user), "Logged in successfully"));
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> Refresh()
    {
        var user = await _auth.RefreshAsync(Request.Cookies["refreshToken"]);
        SetAuthCookies(user);
        await _uow.SaveChangesAsync();
        return Ok(ApiResult.Ok(UserDto.From(user), "Token refreshed"));
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await _auth.LogoutAsync(User.UserId());
        var secure = bool.TryParse(Configuration?["Cookies:Secure"], out var s) && s;
        foreach (var name in new[] { "accessToken", "refreshToken" })
            Response.Cookies.Delete(name, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Lax, Secure = secure, Path = "/" });
        return Ok(ApiResult.Ok(null, "Logged out"));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var user = await _uow.Users.GetByIdAsync(User.UserId())
                   ?? throw ApiException.Unauthorized("Account not found");
        return Ok(ApiResult.Ok(UserDto.From(user)));
    }

    /// <summary>Token for the SignalR hub (the hub lives on the API origin,
    /// while the browser session cookie is first-party to the web origin).</summary>
    [HttpPost("signalr-token")]
    [Authorize]
    public async Task<IActionResult> SignalRToken()
    {
        var user = await _uow.Users.GetByIdAsync(User.UserId())
                   ?? throw ApiException.Unauthorized("Account not found");
        return Ok(ApiResult.Ok(new { token = _tokens.CreateAccessToken(user) }));
    }
}
