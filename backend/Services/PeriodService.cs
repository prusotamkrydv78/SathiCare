using SathiCare.Api.Common;
using SathiCare.Api.Models;
using SathiCare.Api.Repositories;

namespace SathiCare.Api.Services;

public interface IPeriodService
{
    Task<object> GetCurrentAsync(Guid userId);
    Task<object> GetStatsAsync(Guid userId);
    Task<List<object>> GetHistoryAsync(Guid userId);
    Task<object> StartCycleAsync(Guid userId, string flowLevel, int painLevel, string? notes);
    Task<object> EndCycleAsync(Guid userId);
    Task<object> AddLogAsync(Guid userId, List<string> symptoms, string? mood, string? notes);
    Task<object> PredictAsync(Guid userId);
}

/// <summary>Deterministic cycle math — predictions are computed, never "AI".</summary>
public class PeriodService : IPeriodService
{
    private readonly IUnitOfWork _uow;

    public PeriodService(IUnitOfWork uow) => _uow = uow;

    private async Task<List<PeriodCycle>> GetCyclesAsync(Guid userId) =>
        await _uow.PeriodCycles.ListAsync(c => c.UserId == userId);

    private static (double avgCycle, double avgPeriod, string regularity, List<int> lengths) ComputeStats(List<PeriodCycle> cycles)
    {
        var sorted = cycles.OrderBy(c => c.StartDate).ToList();
        var lengths = new List<int>();
        for (var i = 1; i < sorted.Count; i++)
            lengths.Add(sorted[i].StartDate.DayNumber - sorted[i - 1].StartDate.DayNumber);
        var avgCycle = lengths.Count > 0 ? lengths.Average() : 29;
        var avgPeriod = sorted.Count > 0 && sorted.All(c => c.EndDate != null)
            ? sorted.Average(c => (c.EndDate!.Value.DayNumber - c.StartDate.DayNumber) + 1)
            : 5;
        var regularity = lengths.Count < 2 ? "unknown"
            : lengths.Max() - lengths.Min() <= 4 ? "regular"
            : lengths.Max() - lengths.Min() <= 8 ? "slightly irregular"
            : "irregular";
        return (Math.Round(avgCycle, 1), Math.Round(avgPeriod, 1), regularity, lengths);
    }

    private static DateOnly PredictNextStart(PeriodCycle last, double avgCycle) =>
        last.StartDate.AddDays((int)Math.Round(avgCycle));

    private static string PhaseFor(int cycleDay, int periodLength)
    {
        if (cycleDay <= periodLength) return "menstrual";
        if (cycleDay is >= 10 and <= 16) return "ovulation";
        if (cycleDay > 16) return "luteal";
        return "follicular";
    }

    public async Task<object> GetCurrentAsync(Guid userId)
    {
        var cycles = await GetCyclesAsync(userId);
        var latest = cycles.OrderByDescending(c => c.StartDate).FirstOrDefault();
        if (latest is null) throw ApiException.NotFound("No period data yet. Log your first period to begin.");

        var (avgCycle, _, _, _) = ComputeStats(cycles);
        var lastStart = cycles.Max(c => c.StartDate);
        var cycleDay = DateOnly.FromDateTime(DateTime.UtcNow).DayNumber - lastStart.DayNumber + 1;
        var duration = latest.EndDate?.DayNumber - latest.StartDate.DayNumber + 1;

        return new
        {
            cycle = ToCycleDto(latest),
            cycleDay = Math.Max(cycleDay, 1),
            phase = PhaseFor(Math.Max(cycleDay, 1), duration ?? 5),
            nextPredictedStart = PredictNextStart(latest, avgCycle),
            daysUntilNext = (PredictNextStart(latest, avgCycle).DayNumber - DateOnly.FromDateTime(DateTime.UtcNow).DayNumber)
        };
    }

    public async Task<object> GetStatsAsync(Guid userId)
    {
        var cycles = await GetCyclesAsync(userId);
        if (cycles.Count == 0) throw ApiException.NotFound("No period data yet.");
        var (avgCycle, avgPeriod, regularity, lengths) = ComputeStats(cycles);
        return new
        {
            totalCycles = cycles.Count,
            averageCycleLength = avgCycle,
            averagePeriodDuration = avgPeriod,
            regularity,
            cycleLengths = lengths,
            lastPeriodStart = cycles.Max(c => c.StartDate)
        };
    }

    public async Task<List<object>> GetHistoryAsync(Guid userId)
    {
        var cycles = await GetCyclesAsync(userId);
        return cycles.OrderByDescending(c => c.StartDate).Select(ToCycleDto).ToList();
    }

    public async Task<object> StartCycleAsync(Guid userId, string flowLevel, int painLevel, string? notes)
    {
        var cycles = await GetCyclesAsync(userId);
        var active = cycles.Where(c => c.EndDate == null).OrderByDescending(c => c.StartDate).FirstOrDefault();
        if (active is not null && active.StartDate >= DateOnly.FromDateTime(DateTime.UtcNow).AddDays(-10))
            throw ApiException.Conflict("You already have an ongoing period. End it before starting a new one.");

        var cycle = new PeriodCycle
        {
            UserId = userId,
            StartDate = DateOnly.FromDateTime(DateTime.UtcNow),
            FlowLevel = flowLevel is "light" or "medium" or "heavy" ? flowLevel : "medium",
            PainLevel = Math.Clamp(painLevel, 0, 10),
            Notes = notes
        };
        await _uow.PeriodCycles.AddAsync(cycle);
        await _uow.SaveChangesAsync();
        return ToCycleDto(cycle);
    }

    public async Task<object> EndCycleAsync(Guid userId)
    {
        var cycles = await GetCyclesAsync(userId);
        var active = cycles.Where(c => c.EndDate == null).OrderByDescending(c => c.StartDate).FirstOrDefault()
                     ?? throw ApiException.NotFound("No ongoing period to end.");

        var tracked = await _uow.PeriodCycles.FindAsync(c => c.Id == active.Id);
        tracked!.EndDate = DateOnly.FromDateTime(DateTime.UtcNow);
        _uow.PeriodCycles.Update(tracked);
        await _uow.SaveChangesAsync();
        return ToCycleDto(tracked);
    }

    public async Task<object> AddLogAsync(Guid userId, List<string> symptoms, string? mood, string? notes)
    {
        var cycles = await GetCyclesAsync(userId);
        var active = cycles.OrderByDescending(c => c.StartDate).FirstOrDefault()
                     ?? throw ApiException.NotFound("Start a period first, then add daily logs to it.");

        var log = new PeriodLog
        {
            CycleId = active.Id,
            UserId = userId,
            LogDate = DateOnly.FromDateTime(DateTime.UtcNow),
            SymptomsJson = System.Text.Json.JsonSerializer.Serialize(symptoms ?? new List<string>()),
            Mood = mood,
            Notes = notes
        };
        await _uow.PeriodLogs.AddAsync(log);
        await _uow.SaveChangesAsync();
        return new { log.Id, log.LogDate, symptoms, log.Mood, log.Notes };
    }

    public async Task<object> PredictAsync(Guid userId)
    {
        var cycles = await GetCyclesAsync(userId);
        if (cycles.Count == 0) throw ApiException.NotFound("No period data yet.");

        var (avgCycle, avgPeriod, regularity, _) = ComputeStats(cycles);
        var last = cycles.OrderByDescending(c => c.StartDate).First();
        var next = PredictNextStart(last, avgCycle);
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var ovulation = next.AddDays(-14);
        var fertileStart = ovulation.AddDays(-5);
        var fertileEnd = ovulation.AddDays(1);

        return new
        {
            averageCycleLength = avgCycle,
            averagePeriodDuration = avgPeriod,
            regularity,
            nextPeriodStart = next,
            daysUntilNextPeriod = next.DayNumber - today.DayNumber,
            ovulationDate = ovulation,
            fertileWindow = new { start = fertileStart, end = fertileEnd },
            inFertileWindow = today >= fertileStart && today <= fertileEnd
        };
    }

    private static object ToCycleDto(PeriodCycle c) => new
    {
        c.Id,
        startDate = c.StartDate,
        endDate = c.EndDate,
        durationDays = c.EndDate?.DayNumber - c.StartDate.DayNumber + 1,
        flowLevel = c.FlowLevel,
        painLevel = c.PainLevel,
        c.Notes
    };
}
