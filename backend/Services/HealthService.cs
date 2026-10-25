using SathiCare.Api.Common;
using SathiCare.Api.Models;
using SathiCare.Api.Repositories;

namespace SathiCare.Api.Services;

public interface IHealthService
{
    Task<object> ChatAsync(Guid userId, Guid? chatId, string message);
    Task<List<object>> GetChatsAsync(Guid userId);
    Task<List<object>> GetMessagesAsync(Guid userId, Guid chatId);
    Task DeleteChatAsync(Guid userId, Guid chatId);
    Task<object> AnalyzeSymptomsAsync(Guid userId, List<string> symptoms, string? notes);
    Task<object> DailyTipAsync();
}

/// <summary>Saathi AI — deterministic mock with danger-sign escalation, persisted history.</summary>
public class HealthService : IHealthService
{
    private readonly IUnitOfWork _uow;

    public HealthService(IUnitOfWork uow) => _uow = uow;

    public async Task<object> ChatAsync(Guid userId, Guid? chatId, string message)
    {
        if (string.IsNullOrWhiteSpace(message))
            throw ApiException.BadRequest("Message cannot be empty.");

        HealthChat chat;
        if (chatId is { } id)
        {
            chat = await _uow.HealthChats.FindAsync(c => c.Id == id && c.UserId == userId)
                   ?? throw ApiException.NotFound("Chat not found.");
        }
        else
        {
            chat = new HealthChat
            {
                UserId = userId,
                Title = message.Length > 48 ? message[..45] + "…" : message
            };
            await _uow.HealthChats.AddAsync(chat);
        }

        var ai = AiService.Reply(message);
        await _uow.HealthChatMessages.AddRangeAsync(new[]
        {
            new HealthChatMessage { ChatId = chat.Id, Role = "user", Content = message },
            new HealthChatMessage { ChatId = chat.Id, Role = "assistant", Content = ai.Reply, IsDangerFlag = ai.RedFlag }
        });
        chat.UpdatedAt = DateTime.UtcNow;
        await _uow.SaveChangesAsync();

        return new
        {
            chatId = chat.Id,
            title = chat.Title,
            reply = ai.Reply,
            redFlag = ai.RedFlag,
            actions = ai.Actions,
            dangerSigns = ai.Matches
        };
    }

    public async Task<List<object>> GetChatsAsync(Guid userId)
    {
        var chats = await _uow.HealthChats.ListAsync(c => c.UserId == userId);
        return chats.OrderByDescending(c => c.UpdatedAt)
            .Select(c => (object)new { c.Id, c.Title, updatedAt = c.UpdatedAt }).ToList();
    }

    public async Task<List<object>> GetMessagesAsync(Guid userId, Guid chatId)
    {
        var chat = await _uow.HealthChats.FindAsync(c => c.Id == chatId && c.UserId == userId)
                   ?? throw ApiException.NotFound("Chat not found.");
        var messages = await _uow.HealthChatMessages.ListAsync(m => m.ChatId == chatId);
        return messages.OrderBy(m => m.CreatedAt)
            .Select(m => (object)new { m.Id, role = m.Role, content = m.Content, danger = m.IsDangerFlag, createdAt = m.CreatedAt })
            .ToList();
    }

    public async Task DeleteChatAsync(Guid userId, Guid chatId)
    {
        var chat = await _uow.HealthChats.FindAsync(c => c.Id == chatId && c.UserId == userId)
                   ?? throw ApiException.NotFound("Chat not found.");
        var messages = await _uow.HealthChatMessages.ListAsync(m => m.ChatId == chatId);
        _uow.HealthChatMessages.RemoveRange(messages);
        _uow.HealthChats.Remove(chat);
        await _uow.SaveChangesAsync();
    }

    public async Task<object> AnalyzeSymptomsAsync(Guid userId, List<string> symptoms, string? notes)
    {
        var ai = AiService.AnalyzeSymptoms(symptoms, notes);
        return new
        {
            analyzed = symptoms,
            severity = ai.RedFlag ? "emergency" : "mild",
            advice = ai.Reply,
            redFlag = ai.RedFlag,
            actions = ai.Actions
        };
    }

    public Task<object> DailyTipAsync() =>
        Task.FromResult((object)new { tip = AiService.DailyTip() });
}
