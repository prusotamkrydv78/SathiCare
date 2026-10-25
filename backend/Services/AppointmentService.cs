using System.Text.Json;
using SathiCare.Api.Common;
using SathiCare.Api.Models;
using SathiCare.Api.Repositories;

namespace SathiCare.Api.Services;

public interface IAppointmentService
{
    Task<List<object>> ListDoctorsAsync(string? search, string? specialization);
    Task<object> GetDoctorAsync(Guid doctorId);
    Task<object> GetAvailabilityAsync(Guid doctorId, DateOnly date);
    Task<object> BookAsync(Guid patientId, Guid doctorId, DateOnly date, string time, string reason);
    Task<List<object>> MineAsync(Guid patientId);
    Task<List<object>> DoctorMineAsync(Guid doctorUserId, Guid doctorId);
    Task<object> GetByIdForUserAsync(Guid userId, Guid appointmentId, bool isDoctor);
    Task<object> AcceptAsync(Guid doctorId, Guid appointmentId);
    Task<object> RejectAsync(Guid doctorId, Guid appointmentId, string? reason);
    Task<object> CompleteAsync(Guid doctorId, Guid appointmentId, string notes, string? prescription);
    Task<object> CancelAsync(Guid patientId, Guid appointmentId);
    Task<object> RateAsync(Guid patientId, Guid appointmentId, int rating);
}

public class AppointmentService : IAppointmentService
{
    private readonly IUnitOfWork _uow;
    private readonly INotificationService _notify;

    public AppointmentService(IUnitOfWork uow, INotificationService notify)
    {
        _uow = uow;
        _notify = notify;
    }

    private static readonly string[] Weekdays = { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };

    private static List<AvailabilitySlot> ParseAvailability(string json)
    {
        try { return JsonSerializer.Deserialize<List<AvailabilitySlot>>(json) ?? new(); }
        catch { return new(); }
    }

    public async Task<List<object>> ListDoctorsAsync(string? search, string? specialization)
    {
        var doctors = await _uow.Doctors.ListAsync(d => d.IsAvailable);
        var q = (search ?? "").Trim().ToLowerInvariant();
        var filtered = doctors.Where(d =>
            (string.IsNullOrEmpty(q) ||
             d.Name.ToLowerInvariant().Contains(q) ||
             d.Specialization.ToLowerInvariant().Contains(q)) &&
            (string.IsNullOrEmpty(specialization) || d.Specialization.Equals(specialization, StringComparison.OrdinalIgnoreCase)));
        return filtered.OrderByDescending(d => d.RatingAverage).Select(DoctorDto).ToList();
    }

    public async Task<object> GetDoctorAsync(Guid doctorId)
    {
        var d = await _uow.Doctors.GetByIdAsync(doctorId) ?? throw ApiException.NotFound("Doctor not found.");
        return DoctorDto(d);
    }

    public async Task<object> GetAvailabilityAsync(Guid doctorId, DateOnly date)
    {
        var d = await _uow.Doctors.GetByIdAsync(doctorId) ?? throw ApiException.NotFound("Doctor not found.");
        var slots = ParseAvailability(d.AvailabilityJson);
        var weekday = Weekdays[(int)date.DayOfWeek];
        var day = slots.FirstOrDefault(s => s.Day.Equals(weekday, StringComparison.OrdinalIgnoreCase));
        var all = day?.Slots ?? new List<string>();

        var taken = (await _uow.Appointments.ListAsync(a =>
            a.DoctorId == doctorId && a.ScheduledDate == date &&
            (a.Status == AppointmentStatus.Accepted || a.Status == AppointmentStatus.Pending)))
            .Select(a => a.ScheduledTime).ToHashSet();

        return new { date, weekday, available = all.Where(s => !taken.Contains(s)).ToList(), booked = all.Where(taken.Contains).ToList() };
    }

    public async Task<object> BookAsync(Guid patientId, Guid doctorId, DateOnly date, string time, string reason)
    {
        if (date < DateOnly.FromDateTime(DateTime.UtcNow))
            throw ApiException.BadRequest("Appointment date cannot be in the past.");
        if (string.IsNullOrWhiteSpace(reason))
            throw ApiException.BadRequest("Please describe the reason for your visit.");

        var doctor = await _uow.Doctors.FindAsync(d => d.Id == doctorId && d.IsAvailable)
                     ?? throw ApiException.NotFound("Doctor not found or unavailable.");

        // Slot must be within doctor availability (unless doctor has no availability set)
        var weekday = Weekdays[(int)date.DayOfWeek];
        var day = ParseAvailability(doctor.AvailabilityJson).FirstOrDefault(s => s.Day.Equals(weekday, StringComparison.OrdinalIgnoreCase));
        if (day is { Slots.Count: > 0 } && !day.Slots.Contains(time))
            throw ApiException.BadRequest($"Selected time is not available. {doctor.Name} is available at: {string.Join(", ", day.Slots)} on {weekday}.");

        var conflict = await _uow.Appointments.FindAsync(a =>
            a.DoctorId == doctorId && a.ScheduledDate == date && a.ScheduledTime == time &&
            (a.Status == AppointmentStatus.Accepted || a.Status == AppointmentStatus.Pending));
        if (conflict is not null)
            throw ApiException.Conflict("That slot has just been taken. Please pick another time.");

        var appointment = new Appointment
        {
            PatientId = patientId,
            DoctorId = doctorId,
            ScheduledDate = date,
            ScheduledTime = time,
            Reason = reason.Trim(),
            Status = AppointmentStatus.Pending
        };
        await _uow.Appointments.AddAsync(appointment);

        var patient = await _uow.Users.GetByIdAsync(patientId);
        var doctorUser = (await _uow.Users.ListAsync(u => u.DoctorId == doctorId)).FirstOrDefault();
        if (doctorUser is not null)
            await _notify.NotifyAsync(doctorUser.Id, NotificationType.Appointment, "New appointment request",
                $"{patient?.Name ?? "A patient"} requested a consultation: {appointment.Reason}", appointment.Id.ToString());

        await _uow.SaveChangesAsync();
        return AppointmentDto(appointment, doctor, patient);
    }

    public async Task<List<object>> MineAsync(Guid patientId)
    {
        var appts = await _uow.Appointments.ListAsync(a => a.PatientId == patientId);
        var patient = await _uow.Users.GetByIdAsync(patientId);
        var doctorIds = appts.Select(a => a.DoctorId).Distinct().ToList();
        var doctors = (await _uow.Doctors.ListAsync(d => doctorIds.Contains(d.Id))).ToDictionary(d => d.Id);
        return appts
            .OrderByDescending(a => a.ScheduledDate).ThenBy(a => a.ScheduledTime)
            .Select(a => AppointmentDto(a, doctors.GetValueOrDefault(a.DoctorId), patient))
            .ToList();
    }

    public async Task<List<object>> DoctorMineAsync(Guid doctorUserId, Guid doctorId)
    {
        var appts = await _uow.Appointments.ListAsync(a => a.DoctorId == doctorId);
        var patientIds = appts.Select(a => a.PatientId).Distinct().ToList();
        var patients = (await _uow.Users.ListAsync(u => patientIds.Contains(u.Id))).ToDictionary(u => u.Id);
        var doctor = await _uow.Doctors.GetByIdAsync(doctorId);
        return appts
            .OrderByDescending(a => a.ScheduledDate).ThenBy(a => a.ScheduledTime)
            .Select(a => AppointmentDto(a, doctor, patients.GetValueOrDefault(a.PatientId), includePatientName: true))
            .ToList();
    }

    public async Task<object> GetByIdForUserAsync(Guid userId, Guid appointmentId, bool isDoctor)
    {
        var a = await _uow.Appointments.GetByIdAsync(appointmentId) ?? throw ApiException.NotFound("Appointment not found.");
        if (isDoctor ? a.DoctorId != userId : a.PatientId != userId)
            throw ApiException.NotFound("Appointment not found.");
        var doctor = await _uow.Doctors.GetByIdAsync(a.DoctorId);
        var patient = await _uow.Users.GetByIdAsync(a.PatientId);
        return AppointmentDto(a, doctor, patient, includePatientName: true);
    }

    public async Task<object> AcceptAsync(Guid doctorId, Guid appointmentId)
    {
        var a = await OwnDoctorAppointmentAsync(doctorId, appointmentId);
        if (a.Status != AppointmentStatus.Pending)
            throw ApiException.BadRequest($"Cannot accept an appointment that is {a.Status.ToString().ToLowerInvariant()}.");

        a.Status = AppointmentStatus.Accepted;
        a.UpdatedAt = DateTime.UtcNow;
        _uow.Appointments.Update(a);

        var chat = await _uow.ConsultationChats.FindAsync(c => c.AppointmentId == appointmentId);
        if (chat is null)
            await _uow.ConsultationChats.AddAsync(new ConsultationChat { AppointmentId = appointmentId, IsActive = true });
        else
        {
            chat.IsActive = true;
            _uow.ConsultationChats.Update(chat);
        }

        var doctor = await _uow.Doctors.GetByIdAsync(doctorId);
        await _notify.NotifyAsync(a.PatientId, NotificationType.Appointment, "Appointment confirmed",
            $"{doctor?.Name ?? "Your doctor"} confirmed your consultation.", appointmentId.ToString());

        await _uow.SaveChangesAsync();
        return AppointmentDto(a, doctor, await _uow.Users.GetByIdAsync(a.PatientId), includePatientName: true);
    }

    public async Task<object> RejectAsync(Guid doctorId, Guid appointmentId, string? reason)
    {
        var a = await OwnDoctorAppointmentAsync(doctorId, appointmentId);
        if (a.Status != AppointmentStatus.Pending)
            throw ApiException.BadRequest($"Cannot reject an appointment that is {a.Status.ToString().ToLowerInvariant()}.");

        a.Status = AppointmentStatus.Rejected;
        a.RejectionReason = string.IsNullOrWhiteSpace(reason) ? "Not available at that time" : reason.Trim();
        a.UpdatedAt = DateTime.UtcNow;
        _uow.Appointments.Update(a);

        var doctor = await _uow.Doctors.GetByIdAsync(doctorId);
        await _notify.NotifyAsync(a.PatientId, NotificationType.Appointment, "Appointment declined",
            $"{doctor?.Name ?? "The doctor"} cannot take your appointment: {a.RejectionReason}", appointmentId.ToString());

        await _uow.SaveChangesAsync();
        return AppointmentDto(a, doctor, await _uow.Users.GetByIdAsync(a.PatientId), includePatientName: true);
    }

    public async Task<object> CompleteAsync(Guid doctorId, Guid appointmentId, string notes, string? prescription)
    {
        var a = await OwnDoctorAppointmentAsync(doctorId, appointmentId);
        if (a.Status == AppointmentStatus.Pending || a.Status == AppointmentStatus.Rejected || a.Status == AppointmentStatus.Cancelled)
            throw ApiException.BadRequest($"Cannot complete an appointment that is {a.Status.ToString().ToLowerInvariant()}.");

        var alreadyCompleted = a.Status == AppointmentStatus.Completed;
        a.ConsultationNotes = string.IsNullOrWhiteSpace(notes) ? a.ConsultationNotes : notes.Trim();
        a.Prescription = prescription?.Trim();
        if (!alreadyCompleted)
        {
            a.Status = AppointmentStatus.Completed;
            var doctor = await _uow.Doctors.GetByIdAsync(doctorId);
            var tracked = await _uow.Doctors.FindAsync(d => d.Id == doctorId);
            if (tracked is not null)
            {
                tracked.TotalConsultations++;
                _uow.Doctors.Update(tracked);
            }
        }
        a.UpdatedAt = DateTime.UtcNow;
        _uow.Appointments.Update(a);

        var chat = await _uow.ConsultationChats.FindAsync(c => c.AppointmentId == appointmentId);
        if (chat is not null)
        {
            chat.IsActive = false;
            chat.EndedAt = DateTime.UtcNow;
            _uow.ConsultationChats.Update(chat);
        }

        var doc = await _uow.Doctors.GetByIdAsync(doctorId);
        await _notify.NotifyAsync(a.PatientId, NotificationType.Consultation, "Consultation completed",
            $"Notes from {doc?.Name ?? "your doctor"} are now in your record.", appointmentId.ToString());

        await _uow.SaveChangesAsync();
        return AppointmentDto(a, doc, await _uow.Users.GetByIdAsync(a.PatientId), includePatientName: true);
    }

    public async Task<object> CancelAsync(Guid patientId, Guid appointmentId)
    {
        var a = await _uow.Appointments.GetByIdAsync(appointmentId) ?? throw ApiException.NotFound("Appointment not found.");
        if (a.PatientId != patientId) throw ApiException.NotFound("Appointment not found.");
        if (a.Status == AppointmentStatus.Completed) throw ApiException.BadRequest("Completed appointments cannot be cancelled.");
        if (a.Status == AppointmentStatus.Cancelled) throw ApiException.BadRequest("Appointment is already cancelled.");

        a.Status = AppointmentStatus.Cancelled;
        a.UpdatedAt = DateTime.UtcNow;
        _uow.Appointments.Update(a);

        var chat = await _uow.ConsultationChats.FindAsync(c => c.AppointmentId == appointmentId);
        if (chat is not null)
        {
            chat.IsActive = false;
            chat.EndedAt = DateTime.UtcNow;
            _uow.ConsultationChats.Update(chat);
        }

        var patient = await _uow.Users.GetByIdAsync(patientId);
        var doctorUser = (await _uow.Users.ListAsync(u => u.DoctorId == a.DoctorId)).FirstOrDefault();
        if (doctorUser is not null)
            await _notify.NotifyAsync(doctorUser.Id, NotificationType.Appointment, "Appointment cancelled",
                $"{patient?.Name ?? "A patient"} cancelled their appointment.", appointmentId.ToString());

        await _uow.SaveChangesAsync();
        return AppointmentDto(a, await _uow.Doctors.GetByIdAsync(a.DoctorId), patient);
    }

    public async Task<object> RateAsync(Guid patientId, Guid appointmentId, int rating)
    {
        if (rating is < 1 or > 5) throw ApiException.BadRequest("Rating must be between 1 and 5.");
        var a = await _uow.Appointments.GetByIdAsync(appointmentId) ?? throw ApiException.NotFound("Appointment not found.");
        if (a.PatientId != patientId) throw ApiException.NotFound("Appointment not found.");
        if (a.Status != AppointmentStatus.Completed) throw ApiException.BadRequest("You can rate only completed consultations.");
        if (a.RatingGiven) throw ApiException.Conflict("You have already rated this consultation.");

        a.RatingGiven = true;
        a.Rating = rating;
        _uow.Appointments.Update(a);

        var doctor = await _uow.Doctors.FindAsync(d => d.Id == a.DoctorId);
        if (doctor is not null)
        {
            doctor.RatingCount++;
            doctor.RatingAverage = Math.Round((doctor.RatingAverage * (doctor.RatingCount - 1) + rating) / doctor.RatingCount, 2);
            _uow.Doctors.Update(doctor);
        }

        await _uow.SaveChangesAsync();
        return new { rated = true, rating };
    }

    private async Task<Appointment> OwnDoctorAppointmentAsync(Guid doctorId, Guid appointmentId)
    {
        var a = await _uow.Appointments.GetByIdAsync(appointmentId) ?? throw ApiException.NotFound("Appointment not found.");
        if (a.DoctorId != doctorId) throw ApiException.NotFound("Appointment not found.");
        return a;
    }

    private static object DoctorDto(Doctor d) => new
    {
        id = d.Id,
        name = d.Name,
        email = d.Email,
        specialization = d.Specialization,
        qualifications = d.Qualifications,
        experienceYears = d.ExperienceYears,
        consultationFee = d.ConsultationFee,
        languages = d.Languages.Split(',').Select(l => l.Trim()).ToList(),
        about = d.About,
        photoUrl = d.PhotoUrl,
        availability = ParseAvailability(d.AvailabilityJson),
        rating = d.RatingAverage,
        totalRatings = d.RatingCount,
        totalConsultations = d.TotalConsultations
    };

    internal static object AppointmentDto(Appointment a, Doctor? d, User? p, bool includePatientName = false) => new
    {
        id = a.Id,
        doctorId = a.DoctorId,
        patientId = a.PatientId,
        doctorName = d?.Name,
        specialization = d?.Specialization,
        consultationFee = d?.ConsultationFee,
        patientName = includePatientName ? p?.Name : null,
        date = a.ScheduledDate,
        time = a.ScheduledTime,
        status = a.Status.ToString().ToLowerInvariant(),
        reason = a.Reason,
        notes = a.ConsultationNotes,
        consultationNotes = a.ConsultationNotes,
        prescription = a.Prescription,
        rejectionReason = a.RejectionReason,
        createdAt = a.CreatedAt
    };
}
