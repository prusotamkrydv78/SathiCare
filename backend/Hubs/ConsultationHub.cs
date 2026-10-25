using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SathiCare.Api.Common;
using SathiCare.Api.Models;
using SathiCare.Api.Repositories;
using SathiCare.Api.Services;

namespace SathiCare.Api.Hubs;

/// <summary>SignalR's default provider reads ClaimTypes.NameIdentifier; our tokens use "sub".</summary>
public class SubUserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection) =>
        connection.User?.FindFirst("sub")?.Value
        ?? connection.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
}

/// <summary>
/// Realtime consultation chat. Auth at handshake (JWT); participation and appointment
/// status are re-verified on every event — the client's claims about identity are never trusted.
/// </summary>
[Authorize]
public class ConsultationHub : Hub
{
    private readonly IUnitOfWork _uow;
    private readonly IConsultationService _consultations;

    public ConsultationHub(IUnitOfWork uow, IConsultationService consultations)
    {
        _uow = uow;
        _consultations = consultations;
    }

    private Guid UserId => Guid.Parse(Context.UserIdentifier ?? Guid.Empty.ToString());
    private bool IsDoctor => Context.User?.Role() == "Doctor";
    private Guid SelfId => IsDoctor ? Context.User?.DoctorId() ?? Guid.Empty : UserId;

    private async Task<(Appointment appt, ConsultationChat chat)> VerifyParticipantAsync(Guid appointmentId)
    {
        var appt = await _uow.Appointments.GetByIdAsync(appointmentId)
                   ?? throw new HubException("Consultation not found.");

        var ok = IsDoctor ? appt.DoctorId == SelfId : appt.PatientId == UserId;
        if (!ok) throw new HubException("You are not part of this consultation.");

        var chat = await _uow.ConsultationChats.FindAsync(c => c.AppointmentId == appointmentId)
                   ?? throw new HubException("This consultation has no chat yet.");
        return (appt, chat);
    }

    public async Task JoinConsultation(Guid appointmentId)
    {
        var (appt, chat) = await VerifyParticipantAsync(appointmentId);
        if (appt.Status != AppointmentStatus.Accepted)
            throw new HubException("Chat opens once the appointment is accepted.");
        if (!chat.IsActive)
            throw new HubException("This consultation has ended.");

        await Groups.AddToGroupAsync(Context.ConnectionId, GroupName(appointmentId));
        await Clients.Caller.SendAsync("consultation-joined", new { appointmentId, isActive = chat.IsActive });
    }

    public async Task LeaveConsultation(Guid appointmentId) =>
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, GroupName(appointmentId));

    public async Task SendMessage(Guid appointmentId, string content)
    {
        if (string.IsNullOrWhiteSpace(content))
            throw new HubException("Message cannot be empty.");
        if (content.Length > 4000) content = content[..4000];

        var (appt, chat) = await VerifyParticipantAsync(appointmentId);
        if (appt.Status != AppointmentStatus.Accepted || !chat.IsActive)
            throw new HubException("This chat is closed.");

        var user = await _uow.Users.GetByIdAsync(UserId);
        var message = await _consultations.PersistMessageAsync(appointmentId, IsDoctor, SelfId,
            IsDoctor ? (await _uow.Doctors.GetByIdAsync(SelfId))?.Name ?? "Doctor" : user?.Name ?? "Patient", content.Trim());

        await Clients.Group(GroupName(appointmentId)).SendAsync("message-received", new
        {
            id = message.Id.ToString(),
            appointmentId = appointmentId.ToString(),
            senderType = message.SenderType.ToString().ToLowerInvariant(),
            senderId = message.SenderId.ToString(),
            senderName = message.SenderName,
            messageType = "text",
            content = message.Content,
            sentAt = message.SentAt
        });
    }

    public async Task Typing(Guid appointmentId)
    {
        await VerifyParticipantAsync(appointmentId);
        await Clients.OthersInGroup(GroupName(appointmentId)).SendAsync("user-typing", new
        {
            appointmentId = appointmentId.ToString(),
            senderType = IsDoctor ? "doctor" : "user",
            senderName = Context.User?.Identity?.Name
        });
    }

    public async Task EndConsultation(Guid appointmentId)
    {
        var (appt, chat) = await VerifyParticipantAsync(appointmentId);
        chat.IsActive = false;
        chat.EndedAt = DateTime.UtcNow;
        _uow.ConsultationChats.Update(chat);
        await _uow.SaveChangesAsync();

        await Clients.Group(GroupName(appointmentId)).SendAsync("consultation-ended", new { appointmentId = appointmentId.ToString() });
    }

    public static string GroupName(Guid appointmentId) => $"consultation-{appointmentId}";
}
