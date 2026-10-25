namespace SathiCare.Api.Models;

public class User
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public UserRole Role { get; set; } = UserRole.User;

    /// <summary>Links a doctor-role login to its Doctor profile record.</summary>
    public Guid? DoctorId { get; set; }

    public string PasswordHash { get; set; } = string.Empty;
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpires { get; set; }
    public bool IsActive { get; set; } = true;
    public string Language { get; set; } = "english";
    public string? HealthProfileJson { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class HealthProfile
{
    public int? Age { get; set; }
    public string? BloodGroup { get; set; }
    public double? HeightCm { get; set; }
    public double? WeightKg { get; set; }
    public List<string> Conditions { get; set; } = new();
    public List<string> Allergies { get; set; } = new();
    public string? LastPeriodDate { get; set; }
    public string? Notes { get; set; }
}
