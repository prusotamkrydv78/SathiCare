using System.Text.Json.Serialization;

namespace SathiCare.Api.Models;

public class Doctor
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Specialization { get; set; } = "General Physician";
    public string? Qualifications { get; set; }
    public int ExperienceYears { get; set; }
    public decimal ConsultationFee { get; set; }
    public string Languages { get; set; } = "English";
    public string? About { get; set; }
    public string? PhotoUrl { get; set; }

    /// <summary>Weekly availability, stored as JSON: [{"day":"Sunday","slots":["10:00-11:00"]}]</summary>
    public string AvailabilityJson { get; set; } = "[]";

    public bool IsAvailable { get; set; } = true;
    public int TotalConsultations { get; set; }
    public double RatingAverage { get; set; }
    public int RatingCount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class AvailabilitySlot
{
    [JsonPropertyName("day")]
    public string Day { get; set; } = string.Empty;

    [JsonPropertyName("slots")]
    public List<string> Slots { get; set; } = new();
}
