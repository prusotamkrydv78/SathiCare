namespace SathiCare.Api.Models;

public class PeriodCycle
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string FlowLevel { get; set; } = "medium"; // light | medium | heavy
    public int PainLevel { get; set; } // 0-10
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class PeriodLog
{
    public Guid Id { get; set; }
    public Guid CycleId { get; set; }
    public Guid UserId { get; set; }
    public DateOnly LogDate { get; set; }
    public string SymptomsJson { get; set; } = "[]";
    public string? Mood { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Pregnancy
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateOnly LmpDate { get; set; }
    public DateOnly? DueDate { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class PregnancyLog
{
    public Guid Id { get; set; }
    public Guid PregnancyId { get; set; }
    public Guid UserId { get; set; }
    public DateOnly LogDate { get; set; }
    public string LogType { get; set; } = "note"; // weight | bp | symptom | kick | contraction | note
    public string? Value { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
