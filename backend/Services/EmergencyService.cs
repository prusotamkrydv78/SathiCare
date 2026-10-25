using System.Text.RegularExpressions;
using SathiCare.Api.Common;
using SathiCare.Api.Models;
using SathiCare.Api.Repositories;

namespace SathiCare.Api.Services;

public interface IEmergencyService
{
    Task<List<object>> GetContactsAsync(Guid userId);
    Task<List<object>> AddContactAsync(Guid userId, string name, string phone, string relation);
    Task RemoveContactAsync(Guid userId, Guid contactId);
    Task<object> TriggerSosAsync(Guid userId, double? latitude, double? longitude, string? locationLabel, string? message);
    Task<List<object>> GetAlertsAsync(Guid userId);
}

public class EmergencyService : IEmergencyService
{
    private static readonly Regex NepalPhone = new(@"^\+977[\s-]?\d{10}$", RegexOptions.Compiled);
    private static readonly TimeSpan Cooldown = TimeSpan.FromMinutes(2);

    private readonly IUnitOfWork _uow;

    public EmergencyService(IUnitOfWork uow) => _uow = uow;

    private static string NormalizePhone(string phone)
    {
        var trimmed = phone.Trim().Replace(" ", "").Replace("-", "");
        if (trimmed.StartsWith("977") && trimmed.Length == 13) return "+" + trimmed;
        if (trimmed.Length == 10 && trimmed.All(char.IsDigit)) return "+977" + trimmed;
        return trimmed.StartsWith("+977") ? trimmed : phone.Trim();
    }

    public async Task<List<object>> GetContactsAsync(Guid userId)
    {
        var contacts = await _uow.EmergencyContacts.ListAsync(c => c.UserId == userId);
        return contacts.OrderBy(c => c.CreatedAt)
            .Select(c => (object)new { c.Id, c.Name, c.Phone, c.Relation }).ToList();
    }

    public async Task<List<object>> AddContactAsync(Guid userId, string name, string phone, string relation)
    {
        if (string.IsNullOrWhiteSpace(name)) throw ApiException.BadRequest("Name is required.");
        var normalized = NormalizePhone(phone);
        if (!NepalPhone.IsMatch(normalized))
            throw ApiException.BadRequest("Enter a valid Nepal mobile number, e.g. +977 98XXXXXXXX.");

        var contacts = await _uow.EmergencyContacts.ListAsync(c => c.UserId == userId);
        if (contacts.Count >= 5)
            throw ApiException.BadRequest("You can keep up to 5 emergency contacts.");

        await _uow.EmergencyContacts.AddAsync(new EmergencyContact
        {
            UserId = userId,
            Name = name.Trim(),
            Phone = normalized,
            Relation = string.IsNullOrWhiteSpace(relation) ? "Family" : relation.Trim()
        });
        await _uow.SaveChangesAsync();
        return await GetContactsAsync(userId);
    }

    public async Task RemoveContactAsync(Guid userId, Guid contactId)
    {
        var contact = await _uow.EmergencyContacts.FindAsync(c => c.Id == contactId && c.UserId == userId)
                      ?? throw ApiException.NotFound("Contact not found.");
        var tracked = await _uow.EmergencyContacts.GetByIdAsync(contactId);
        _uow.EmergencyContacts.Remove(tracked!);
        await _uow.SaveChangesAsync();
    }

    public async Task<object> TriggerSosAsync(Guid userId, double? latitude, double? longitude, string? locationLabel, string? message)
    {
        var user = await _uow.Users.GetByIdAsync(userId) ?? throw ApiException.Unauthorized("Account not found.");

        // Cooldown: ignore rapid repeat triggers
        var recent = (await _uow.SosAlerts.ListAsync(a => a.UserId == userId))
            .Where(a => DateTime.UtcNow - a.CreatedAt < Cooldown).ToList();
        if (recent.Count > 0)
            throw ApiException.TooMany("SOS was just triggered. Please wait a moment before trying again.");

        var contacts = await _uow.EmergencyContacts.ListAsync(c => c.UserId == userId);
        if (contacts.Count == 0)
            throw ApiException.BadRequest("Add at least one emergency contact before triggering SOS.");

        // Mock SMS: logged, never actually sent (demo mode)
        var notified = new List<object>();
        foreach (var c in contacts)
        {
            await _uow.SmsLogs.AddAsync(new SmsLog
            {
                To = c.Phone,
                Message = $"[SathiCare SOS] {user.Name} needs help now. Location: {locationLabel ?? "unknown"}. This is a demo message — no real SMS was sent.",
                Purpose = "sos"
            });
            notified.Add(new { c.Name, phone = c.Phone, smsSent = true });
        }

        var alert = new SosAlert
        {
            UserId = userId,
            UserName = user.Name,
            Latitude = latitude,
            Longitude = longitude,
            LocationLabel = locationLabel,
            Message = message,
            ContactsNotifiedJson = System.Text.Json.JsonSerializer.Serialize(notified)
        };
        await _uow.SosAlerts.AddAsync(alert);
        await _uow.SaveChangesAsync();

        return new
        {
            alertId = alert.Id,
            contactsNotified = notified,
            smsLog = "Demo mode: SMS messages were logged, not sent.",
            hotlines = new[] { new { label = "Ambulance", phone = "102" }, new { label = "Health helpline", phone = "1115" } }
        };
    }

    public async Task<List<object>> GetAlertsAsync(Guid userId)
    {
        var alerts = await _uow.SosAlerts.ListAsync(a => a.UserId == userId);
        return alerts.OrderByDescending(a => a.CreatedAt)
            .Select(a => (object)new
            {
                a.Id,
                location = new { a.Latitude, a.Longitude, label = a.LocationLabel },
                a.Message,
                status = a.Status.ToString().ToLowerInvariant(),
                createdAt = a.CreatedAt,
                resolvedAt = a.ResolvedAt
            })
            .ToList();
    }
}
