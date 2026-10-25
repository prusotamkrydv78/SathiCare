using SathiCare.Api.Models;
using SathiCare.Api.Repositories;

namespace SathiCare.Api.Services;

public interface IDashboardService
{
    Task<object> GetDashboardAsync(Guid userId);
}

public class DashboardService : IDashboardService
{
    private readonly IUnitOfWork _uow;
    private readonly IPeriodService _period;

    public DashboardService(IUnitOfWork uow, IPeriodService period)
    {
        _uow = uow;
        _period = period;
    }

    public async Task<object> GetDashboardAsync(Guid userId)
    {
        var user = await _uow.Users.GetByIdAsync(userId);

        // Period insights (tolerates no data)
        object periodInsights;
        try { periodInsights = await _period.GetCurrentAsync(userId); }
        catch { periodInsights = new { hasData = false }; }

        // Pregnancy insights (active pregnancy only)
        var pregnancy = (await _uow.Pregnancies.ListAsync(p => p.UserId == userId && p.IsActive))
            .OrderByDescending(p => p.LmpDate).FirstOrDefault();
        object? pregnancyInsights = null;
        if (pregnancy is not null)
        {
            var days = DateOnly.FromDateTime(DateTime.UtcNow).DayNumber - pregnancy.LmpDate.DayNumber;
            var week = Math.Clamp(days / 7, 0, 42);
            var trimester = week < 14 ? 1 : week < 28 ? 2 : 3;
            pregnancyInsights = new
            {
                active = true,
                week,
                day = Math.Clamp(days % 7, 0, 6),
                trimester,
                dueDate = pregnancy.DueDate,
                lmpDate = pregnancy.LmpDate
            };
        }

        // Upcoming appointments with doctor info
        var appts = await _uow.Appointments.ListAsync(a =>
            a.PatientId == userId &&
            (a.Status == AppointmentStatus.Accepted || a.Status == AppointmentStatus.Pending));
        var doctorIds = appts.Select(a => a.DoctorId).Distinct().ToList();
        var doctors = (await _uow.Doctors.ListAsync(d => doctorIds.Contains(d.Id))).ToDictionary(d => d.Id);
        var upcoming = appts
            .Where(a => a.ScheduledDate >= DateOnly.FromDateTime(DateTime.UtcNow))
            .OrderBy(a => a.ScheduledDate).ThenBy(a => a.ScheduledTime)
            .Take(3)
            .Select(a => doctors.TryGetValue(a.DoctorId, out var d) ? new
            {
                a.Id,
                doctorName = d?.Name ?? "Doctor",
                specialization = d?.Specialization ?? "",
                date = a.ScheduledDate,
                time = a.ScheduledTime,
                status = a.Status.ToString().ToLowerInvariant()
            } : null)
            .Where(x => x != null)
            .ToList();

        // Notifications
        var notifications = (await _uow.Notifications.ListAsync(n => n.UserId == userId))
            .OrderByDescending(n => n.CreatedAt).Take(5)
            .Select(n => new { n.Id, n.Title, n.Message, n.IsRead, createdAt = n.CreatedAt }).ToList();
        var unread = await _uow.Notifications.CountAsync(n => n.UserId == userId && !n.IsRead);

        return new
        {
            user = new { name = user?.Name ?? "", language = user?.Language ?? "english" },
            today = DateOnly.FromDateTime(DateTime.UtcNow),
            periodInsights,
            pregnancyInsights,
            upcomingAppointments = upcoming,
            recentNotifications = notifications,
            unreadNotifications = unread
        };
    }
}
