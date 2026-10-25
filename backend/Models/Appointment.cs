namespace SathiCare.Api.Models;

public class Appointment
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    public DateOnly ScheduledDate { get; set; }
    public string ScheduledTime { get; set; } = string.Empty;
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
    public string Reason { get; set; } = string.Empty;

    /// <summary>JSON array of symptom strings the patient selected.</summary>
    public string SymptomsJson { get; set; } = "[]";

    public string? ConsultationNotes { get; set; }
    public string? Prescription { get; set; }
    public string? RejectionReason { get; set; }

    /// <summary>Patient rating 1-5, set once after completion.</summary>
    public int? Rating { get; set; }
    public bool RatingGiven { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
