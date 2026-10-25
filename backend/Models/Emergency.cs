namespace SathiCare.Api.Models;

public class EmergencyContact
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty; // +977XXXXXXXXXX
    public string Relation { get; set; } = "Family";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class SosAlert
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? LocationLabel { get; set; }
    public string? Message { get; set; }
    public SosStatus Status { get; set; } = SosStatus.Active;
    public string ContactsNotifiedJson { get; set; } = "[]";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }
}
