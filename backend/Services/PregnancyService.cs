using SathiCare.Api.Common;
using SathiCare.Api.Models;
using SathiCare.Api.Repositories;

namespace SathiCare.Api.Services;

public interface IPregnancyService
{
    Task<object> GetCurrentAsync(Guid userId);
    Task<object> StartAsync(Guid userId, DateOnly lmpDate, string? notes);
    Task<object> EndAsync(Guid userId);
    Task<object> AddLogAsync(Guid userId, string logType, string? value, string? notes);
    Task<List<object>> GetLogsAsync(Guid userId);
    Task<object> GetInsightsAsync(Guid userId);
}

public class PregnancyService : IPregnancyService
{
    private readonly IUnitOfWork _uow;

    public PregnancyService(IUnitOfWork uow) => _uow = uow;

    private async Task<Pregnancy?> GetActiveAsync(Guid userId) =>
        (await _uow.Pregnancies.ListAsync(p => p.UserId == userId && p.IsActive))
        .OrderByDescending(p => p.LmpDate).FirstOrDefault();

    private static (int week, int day, int trimester, DateOnly due) Compute(DateOnly lmp)
    {
        var days = DateOnly.FromDateTime(DateTime.UtcNow).DayNumber - lmp.DayNumber;
        var clamped = Math.Clamp(days, 0, 300);
        var week = clamped / 7;
        return (week, clamped % 7, week < 14 ? 1 : week < 28 ? 2 : 3, lmp.AddDays(280));
    }

    public async Task<object> GetCurrentAsync(Guid userId)
    {
        var p = await GetActiveAsync(userId)
                ?? throw ApiException.NotFound("No active pregnancy. Add your LMP date to begin.");
        var (week, day, trimester, due) = Compute(p.LmpDate);
        return new
        {
            id = p.Id,
            lmpDate = p.LmpDate,
            dueDate = p.DueDate,
            week, day, trimester,
            totalDays = week * 7 + day,
            notes = p.Notes
        };
    }

    public async Task<object> StartAsync(Guid userId, DateOnly lmpDate, string? notes)
    {
        if (lmpDate > DateOnly.FromDateTime(DateTime.UtcNow))
            throw ApiException.BadRequest("LMP date cannot be in the future.");
        if (lmpDate < DateOnly.FromDateTime(DateTime.UtcNow).AddDays(-300))
            throw ApiException.BadRequest("That LMP date is too far in the past. Please check the date.");
        if (await GetActiveAsync(userId) is not null)
            throw ApiException.Conflict("You already have an active pregnancy tracking.");

        var p = new Pregnancy
        {
            UserId = userId,
            LmpDate = lmpDate,
            DueDate = lmpDate.AddDays(280),
            IsActive = true,
            Notes = notes
        };
        await _uow.Pregnancies.AddAsync(p);
        await _uow.SaveChangesAsync();
        return await GetCurrentAsync(userId);
    }

    public async Task<object> EndAsync(Guid userId)
    {
        var p = await GetActiveAsync(userId) ?? throw ApiException.NotFound("No active pregnancy.");
        var tracked = await _uow.Pregnancies.FindAsync(x => x.Id == p.Id);
        tracked!.IsActive = false;
        _uow.Pregnancies.Update(tracked);
        await _uow.SaveChangesAsync();
        return new { ended = true };
    }

    public async Task<object> AddLogAsync(Guid userId, string logType, string? value, string? notes)
    {
        var p = await GetActiveAsync(userId) ?? throw ApiException.NotFound("No active pregnancy.");
        var log = new PregnancyLog
        {
            PregnancyId = p.Id,
            UserId = userId,
            LogDate = DateOnly.FromDateTime(DateTime.UtcNow),
            LogType = logType is "weight" or "bp" or "symptom" or "kick" or "contraction" or "note" ? logType : "note",
            Value = value,
            Notes = notes
        };
        await _uow.PregnancyLogs.AddAsync(log);
        await _uow.SaveChangesAsync();
        return new { log.Id, log.LogDate, log.LogType, log.Value, log.Notes };
    }

    public async Task<List<object>> GetLogsAsync(Guid userId)
    {
        var p = await GetActiveAsync(userId) ?? throw ApiException.NotFound("No active pregnancy.");
        var logs = await _uow.PregnancyLogs.ListAsync(l => l.PregnancyId == p.Id);
        return logs.OrderByDescending(l => l.LogDate)
            .Select(l => (object)new { l.Id, date = l.LogDate, type = l.LogType, l.Value, l.Notes })
            .ToList();
    }

    public async Task<object> GetInsightsAsync(Guid userId)
    {
        var p = await GetActiveAsync(userId) ?? throw ApiException.NotFound("No active pregnancy.");
        var (week, day, trimester, due) = Compute(p.LmpDate);

        var logs = await _uow.PregnancyLogs.ListAsync(l => l.PregnancyId == p.Id);
        var weights = logs.Where(l => l.LogType == "weight" && double.TryParse(l.Value, out _))
            .Select(l => (date: l.LogDate, kg: double.Parse(l.Value!))).OrderBy(w => w.date).ToList();

        var dangerSigns = new[]
        {
            "Bleeding or spotting", "Severe headache", "Blurred vision", "Swelling of face/hands",
            "Baby moving less", "Water leaking", "Fever", "Severe stomach pain", "Vomiting that will not stop"
        };
        var tips = new[]
        {
            ("1-4", "Take folic acid daily and rest well. Book your first antenatal visit."),
            ("8-12", "Morning sickness is common — small frequent meals help. First checkup around now."),
            ("13-27", "Energy returns. Eat iron and protein rich food. Feel first kicks around 18-22 weeks."),
            ("28-36", "Track baby kicks daily. Prepare your birth plan and hospital bag."),
            ("37-40", "Full term soon. Watch for labor signs: regular contractions, water breaking."),
            ("40+", "Due time — stay calm, keep kick counts, and contact your doctor for any change.")
        };
        var tip = week <= 4 ? tips[0] : week <= 12 ? tips[1] : week <= 27 ? tips[2] : week <= 36 ? tips[3] : week <= 40 ? tips[4] : tips[5];

        return new
        {
            week, day, trimester, dueDate = due,
            progressPercent = Math.Clamp((week * 7 + day) * 100 / 280, 0, 100),
            babySizeCm = Math.Round(week < 4 ? 0.1 : 2.0 + week * 0.75, 1),
            daysToDue = Math.Max(due.DayNumber - DateOnly.FromDateTime(DateTime.UtcNow).DayNumber, 0),
            weightTrend = weights.Count >= 2 ? new { first = weights.First(), last = weights.Last(), entries = weights.Count } : null,
            thisWeekTip = new { weeks = tip.Item1, text = tip.Item2 },
            dangerSigns
        };
    }
}
