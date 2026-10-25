using SathiCare.Api.Models;
using SathiCare.Api.Repositories;

namespace SathiCare.Api.Services;

public interface INotificationService
{
    Task NotifyAsync(Guid userId, NotificationType type, string title, string message, string? relatedId = null);
    Task<List<object>> ListAsync(Guid userId, bool? unreadOnly, int page, int pageSize);
    Task<int> UnreadCountAsync(Guid userId);
    Task MarkReadAsync(Guid userId, Guid notificationId);
    Task MarkAllReadAsync(Guid userId);
    Task ClearAllAsync(Guid userId);
}

public class NotificationService : INotificationService
{
    private readonly IUnitOfWork _uow;

    public NotificationService(IUnitOfWork uow) => _uow = uow;

    public async Task NotifyAsync(Guid userId, NotificationType type, string title, string message, string? relatedId = null)
    {
        await _uow.Notifications.AddAsync(new Notification
        {
            UserId = userId,
            Type = type,
            Title = title,
            Message = message,
            RelatedId = relatedId
        });
    }

    public async Task<List<object>> ListAsync(Guid userId, bool? unreadOnly, int page, int pageSize)
    {
        var all = await _uow.Notifications.ListAsync(n => n.UserId == userId);
        var filtered = unreadOnly == true ? all.Where(n => !n.IsRead) : all;
        var items = filtered
            .OrderByDescending(n => n.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(n => (object)new { n.Id, type = n.Type.ToString().ToLowerInvariant(), n.Title, n.Message, n.IsRead, n.RelatedId, createdAt = n.CreatedAt })
            .ToList();
        return items;
    }

    public Task<int> UnreadCountAsync(Guid userId) =>
        _uow.Notifications.CountAsync(n => n.UserId == userId && !n.IsRead);

    public async Task MarkReadAsync(Guid userId, Guid notificationId)
    {
        var n = await _uow.Notifications.FindAsync(x => x.Id == notificationId && x.UserId == userId)
                ?? throw SathiCare.Api.Common.ApiException.NotFound("Notification not found.");
        var tracked = await _uow.Notifications.GetByIdAsync(notificationId);
        tracked!.IsRead = true;
        _uow.Notifications.Update(tracked);
        await _uow.SaveChangesAsync();
    }

    public async Task MarkAllReadAsync(Guid userId)
    {
        var unread = await _uow.Notifications.ListAsync(n => n.UserId == userId && !n.IsRead);
        // re-query tracked entities to mutate
        foreach (var n in unread)
        {
            var tracked = await _uow.Notifications.GetByIdAsync(n.Id);
            if (tracked is null) continue;
            tracked.IsRead = true;
            _uow.Notifications.Update(tracked);
        }
        await _uow.SaveChangesAsync();
    }

    public async Task ClearAllAsync(Guid userId)
    {
        var all = await _uow.Notifications.ListAsync(n => n.UserId == userId);
        var tracked = new List<Notification>();
        foreach (var n in all)
        {
            var t = await _uow.Notifications.GetByIdAsync(n.Id);
            if (t is not null) tracked.Add(t);
        }
        _uow.Notifications.RemoveRange(tracked);
        await _uow.SaveChangesAsync();
    }
}
