namespace SathiCare.Api.Models;

public enum UserRole
{
    User = 0,
    Doctor = 1,
    Admin = 2
}

public enum AppointmentStatus
{
    Pending = 0,
    Accepted = 1,
    Rejected = 2,
    Completed = 3,
    Cancelled = 4
}

public enum MessageSenderType
{
    User = 0,
    Doctor = 1
}

public enum NotificationType
{
    System = 0,
    Appointment = 1,
    Consultation = 2,
    Community = 3,
    Emergency = 4
}

public enum SosStatus
{
    Active = 0,
    Resolved = 1
}

public enum ReportStatus
{
    Open = 0,
    Hidden = 1,
    Dismissed = 2
}
