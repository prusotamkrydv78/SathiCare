using BCrypt.Net;
using SathiCare.Api.Common;
using SathiCare.Api.Dtos;
using SathiCare.Api.Models;
using SathiCare.Api.Repositories;

namespace SathiCare.Api.Services;

public interface IAuthService
{
    Task<UserDto> SignupAsync(SignupRequest request);
    Task<User> LoginAsync(LoginRequest request);
    Task<User> RefreshAsync(string? refreshToken);
    Task LogoutAsync(Guid userId);
}

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _uow;
    private readonly ITokenService _tokens;

    public AuthService(IUnitOfWork uow, ITokenService tokens)
    {
        _uow = uow;
        _tokens = tokens;
    }

    public async Task<UserDto> SignupAsync(SignupRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        if (await _uow.Users.AnyAsync(u => u.Email == email))
            throw ApiException.Conflict("Email already registered");

        if (!string.IsNullOrWhiteSpace(request.Phone) &&
            await _uow.Users.AnyAsync(u => u.Phone == request.Phone))
            throw ApiException.Conflict("Phone number already registered");

        var user = new User
        {
            Name = request.Name.Trim(),
            Email = email,
            Phone = request.Phone?.Trim(),
            Language = string.IsNullOrWhiteSpace(request.Language) ? "english" : request.Language,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = UserRole.User
        };

        await _uow.Users.AddAsync(user);
        await _uow.SaveChangesAsync();

        return UserDto.From(user);
    }

    public async Task<User> LoginAsync(LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _uow.Users.FindAsync(u => u.Email == email)
                   ?? throw ApiException.Unauthorized("Invalid email or password");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw ApiException.Unauthorized("Invalid email or password");

        if (!user.IsActive)
            throw ApiException.Forbidden("This account has been deactivated. Contact support.");

        return user;
    }

    public async Task<User> RefreshAsync(string? refreshToken)
    {
        if (string.IsNullOrEmpty(refreshToken))
            throw ApiException.Unauthorized("No refresh token");

        var user = await _uow.Users.FindAsync(u => u.RefreshToken == refreshToken)
                   ?? throw ApiException.Unauthorized("Invalid refresh token");

        if (user.RefreshTokenExpires < DateTime.UtcNow)
            throw ApiException.Unauthorized("Refresh token expired");

        return user;
    }

    public async Task LogoutAsync(Guid userId)
    {
        var user = await _uow.Users.GetByIdAsync(userId);
        if (user is null) return;
        user.RefreshToken = null;
        user.RefreshTokenExpires = null;
        _uow.Users.Update(user);
        await _uow.SaveChangesAsync();
    }
}
