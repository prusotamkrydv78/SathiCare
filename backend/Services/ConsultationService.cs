using SathiCare.Api.Common;
using SathiCare.Api.Models;
using SathiCare.Api.Repositories;

namespace SathiCare.Api.Services;

public interface IConsultationService
{
    Task<List<object>> GetMessagesAsync(Guid userId, bool isDoctor, Guid appointmentId);
    Task<ConsultationMessage> PersistMessageAsync(Guid appointmentId, bool isDoctor, Guid senderId, string senderName, string content);
}

public class ConsultationService : IConsultationService
{
    private readonly IUnitOfWork _uow;

    public ConsultationService(IUnitOfWork uow) => _uow = uow;

    private async Task<(Appointment appt, ConsultationChat chat)> GetOwnedAsync(Guid userId, bool isDoctor, Guid appointmentId)
    {
        var appt = await _uow.Appointments.GetByIdAsync(appointmentId)
                   ?? throw ApiException.NotFound("Consultation not found.");
        if (isDoctor ? appt.DoctorId != userId : appt.PatientId != userId)
            throw ApiException.NotFound("Consultation not found.");

        var chat = await _uow.ConsultationChats.FindAsync(c => c.AppointmentId == appointmentId);
        if (chat is null)
            throw ApiException.NotFound("This consultation has no chat yet.");
        return (appt, chat);
    }

    public async Task<List<object>> GetMessagesAsync(Guid userId, bool isDoctor, Guid appointmentId)
    {
        var (_, chat) = await GetOwnedAsync(userId, isDoctor, appointmentId);
        var messages = await _uow.ConsultationMessages.ListAsync(m => m.ChatId == chat.Id);
        return messages.OrderBy(m => m.SentAt)
            .Select(m => (object)new
            {
                m.Id,
                senderType = m.SenderType.ToString().ToLowerInvariant(),
                senderId = m.SenderId,
                senderName = m.SenderName,
                messageType = m.MessageType,
                content = m.Content,
                fileUrl = m.FileUrl,
                fileName = m.FileName,
                sentAt = m.SentAt,
                isRead = m.IsRead
            })
            .ToList();
    }

    public async Task<ConsultationMessage> PersistMessageAsync(Guid appointmentId, bool isDoctor, Guid senderId, string senderName, string content)
    {
        var (appt, chat) = await GetOwnedAsync(senderId, isDoctor, appointmentId);
        if (appt.Status != AppointmentStatus.Accepted)
            throw ApiException.BadRequest("Chat is open only for accepted appointments.");
        if (!chat.IsActive)
            throw ApiException.BadRequest("This consultation has ended.");

        var message = new ConsultationMessage
        {
            ChatId = chat.Id,
            SenderType = isDoctor ? MessageSenderType.Doctor : MessageSenderType.User,
            SenderId = senderId,
            SenderName = senderName,
            Content = content
        };
        await _uow.ConsultationMessages.AddAsync(message);
        await _uow.SaveChangesAsync();
        return message;
    }
}
