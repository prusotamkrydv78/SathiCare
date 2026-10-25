namespace SathiCare.Api.Models;

/// <summary>A healthcare facility shown on the map / find-care list (seeded from the original hospitals.json).</summary>
public class Facility
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "Hospital";
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string? Hours { get; set; }
    public string? EmergencyServices { get; set; }
    public string Source { get; set; } = "seed";
}

public class Review
{
    public Guid Id { get; set; }
    public string FacilityId { get; set; } = string.Empty;
    public Guid? UserId { get; set; }
    public string UserName { get; set; } = "Anonymous";
    public int Rating { get; set; } // 1-5
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class HealthChat
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; } = "New conversation";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class HealthChatMessage
{
    public Guid Id { get; set; }
    public Guid ChatId { get; set; }
    public string Role { get; set; } = "user"; // user | assistant
    public string Content { get; set; } = string.Empty;
    public bool IsDangerFlag { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>Mock SMS output (demo mode: no real gateway).</summary>
public class SmsLog
{
    public Guid Id { get; set; }
    public string To { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Purpose { get; set; } = "sos";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
