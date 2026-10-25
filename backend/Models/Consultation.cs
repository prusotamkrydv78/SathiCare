namespace SathiCare.Api.Models;

public class ConsultationChat
{
    public Guid Id { get; set; }
    public Guid AppointmentId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? EndedAt { get; set; }

    public List<ConsultationMessage> Messages { get; set; } = new();
}

public class ConsultationMessage
{
    public Guid Id { get; set; }
    public Guid ChatId { get; set; }
    public MessageSenderType SenderType { get; set; }
    public Guid SenderId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public string MessageType { get; set; } = "text"; // text | file
    public string? Content { get; set; }
    public string? FileUrl { get; set; }
    public string? FileName { get; set; }
    public long? FileSize { get; set; }
    public bool IsRead { get; set; }
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}
