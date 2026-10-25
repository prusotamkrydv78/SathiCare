using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace SathiCare.Api.Hubs;

/// <summary>Realtime consultation chat. Full participant + status checks land with the chat feature.</summary>
[Authorize]
public class ConsultationHub : Hub
{
    public async Task JoinConsultation(Guid appointmentId) =>
        await Groups.AddToGroupAsync(Context.ConnectionId, GroupName(appointmentId));

    public async Task LeaveConsultation(Guid appointmentId) =>
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, GroupName(appointmentId));

    public static string GroupName(Guid appointmentId) => $"consultation-{appointmentId}";
}
