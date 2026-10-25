using System.Text.Json;
using BCrypt.Net;
using SathiCare.Api.Models;

namespace SathiCare.Api.Data;

/// <summary>Seeds the demo dataset. Stable GUIDs keep login sessions alive across POST /api/demo/reset.</summary>
public static class DemoSeeder
{
    public const string DemoPassword = "demo1234";

    private static readonly Guid Sita = new("11111111-1111-4111-8111-111111111101");
    private static readonly Guid Gita = new("11111111-1111-4111-8111-111111111102");
    private static readonly Guid Admin = new("11111111-1111-4111-8111-111111111103");

    private static readonly (Guid userId, Guid doctorId, string Key)[] DoctorIds =
    {
        (new("11111111-1111-4111-8111-111111111111"), new("22222222-2222-4222-8222-222222222201"), "anita"),
        (new("11111111-1111-4111-8111-111111111112"), new("22222222-2222-4222-8222-222222222202"), "sabina"),
        (new("11111111-1111-4111-8111-111111111113"), new("22222222-2222-4222-8222-222222222203"), "binod"),
        (new("11111111-1111-4111-8111-111111111114"), new("22222222-2222-4222-8222-222222222204"), "ritu"),
        (new("11111111-1111-4111-8111-111111111115"), new("22222222-2222-4222-8222-222222222205"), "maya"),
        (new("11111111-1111-4111-8111-111111111116"), new("22222222-2222-4222-8222-222222222206"), "puja")
    };

    public static async Task ResetAndSeedAsync(AppDbContext db)
    {
        // Order matters only for readability; FK-less schema allows any order.
        db.SmsLogs.RemoveRange(db.SmsLogs);
        db.HealthChatMessages.RemoveRange(db.HealthChatMessages);
        db.HealthChats.RemoveRange(db.HealthChats);
        db.Reviews.RemoveRange(db.Reviews);
        db.Facilities.RemoveRange(db.Facilities);
        db.PostReports.RemoveRange(db.PostReports);
        db.PostComments.RemoveRange(db.PostComments);
        db.PostLikes.RemoveRange(db.PostLikes);
        db.CommunityPosts.RemoveRange(db.CommunityPosts);
        db.Notifications.RemoveRange(db.Notifications);
        db.SosAlerts.RemoveRange(db.SosAlerts);
        db.EmergencyContacts.RemoveRange(db.EmergencyContacts);
        db.ConsultationMessages.RemoveRange(db.ConsultationMessages);
        db.ConsultationChats.RemoveRange(db.ConsultationChats);
        db.Appointments.RemoveRange(db.Appointments);
        db.PregnancyLogs.RemoveRange(db.PregnancyLogs);
        db.Pregnancies.RemoveRange(db.Pregnancies);
        db.PeriodLogs.RemoveRange(db.PeriodLogs);
        db.PeriodCycles.RemoveRange(db.PeriodCycles);
        db.Doctors.RemoveRange(db.Doctors);
        db.Users.RemoveRange(db.Users);
        await db.SaveChangesAsync();

        var hash = BCrypt.Net.BCrypt.HashPassword(DemoPassword);
        var now = DateTime.UtcNow;
        DateOnly Ago(int days) => DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-days));
        DateOnly Ahead(int days) => DateOnly.FromDateTime(DateTime.UtcNow.AddDays(days));

        // ---- Facilities (from SeedData/hospitals.json, converted once) ----
        var seedPath = Path.Combine(AppContext.BaseDirectory, "SeedData", "hospitals.json");
        if (File.Exists(seedPath))
        {
            using var doc = JsonDocument.Parse(File.ReadAllText(seedPath));
            foreach (var h in doc.RootElement.GetProperty("hospitals").EnumerateArray())
            {
                string Get(string name) => h.TryGetProperty(name, out var v) && v.ValueKind != JsonValueKind.Null ? v.ToString() : "";
                db.Facilities.Add(new Facility
                {
                    Id = Get("id"),
                    Name = Get("name"),
                    Type = string.IsNullOrEmpty(Get("type")) ? "Hospital" : Get("type"),
                    Latitude = h.TryGetProperty("latitude", out var lat) && lat.ValueKind == JsonValueKind.Number ? lat.GetDouble() : 0,
                    Longitude = h.TryGetProperty("longitude", out var lon) && lon.ValueKind == JsonValueKind.Number ? lon.GetDouble() : 0,
                    Address = Get("address"),
                    Phone = Get("phone"),
                    Hours = h.TryGetProperty("isOpen", out var open) ? (open.GetBoolean() ? "Open 24 hours" : "Hours vary") : null,
                    Source = "seed"
                });
            }
        }

        // ---- Users ----
        var sita = new User { Id = Sita, Name = "Sita Kumari Yadav", Email = "sita@demo.np", Phone = "+977-9801234567", Role = UserRole.User, PasswordHash = hash, Language = "english" };
        var gita = new User { Id = Gita, Name = "Gita Sharma", Email = "gita@demo.np", Phone = "+977-9801234568", Role = UserRole.User, PasswordHash = hash, Language = "nepali" };
        var admin = new User { Id = Admin, Name = "SathiCare Admin", Email = "admin@demo.np", Phone = "+977-9801234560", Role = UserRole.Admin, PasswordHash = hash, Language = "english" };
        db.Users.AddRange(sita, gita, admin);

        // ---- Doctors + doctor-role logins ----
        var availability = JsonSerializer.Serialize(new[]
        {
            new { day = "Sunday", slots = new[] { "10:00-11:00", "11:00-12:00", "14:00-15:00" } },
            new { day = "Monday", slots = new[] { "10:00-11:00", "11:00-12:00", "14:00-15:00", "15:00-16:00" } },
            new { day = "Tuesday", slots = new[] { "10:00-11:00", "11:00-12:00", "15:00-16:00" } },
            new { day = "Wednesday", slots = new[] { "10:00-11:00", "14:00-15:00", "15:00-16:00" } },
            new { day = "Thursday", slots = new[] { "10:00-11:00", "11:00-12:00", "14:00-15:00" } },
            new { day = "Friday", slots = new[] { "10:00-11:00", "14:00-15:00" } }
        });

        var doctorDefs = new (Guid userId, Guid doctorId, string name, string email, string phone, string spec, string quals, int exp, string hospital, string city, decimal fee, string langs, double rating, int ratings, int consults, string bio)[]
        {
            (DoctorIds[0].userId, DoctorIds[0].doctorId, "Dr. Anita Chaudhary", "dr.anita@demo.np", "+977-9851001001", "Gynecologist", "MBBS, MD (Gynecology)", 12, "Sita Women's Hospital", "Janakpur", 1200, "Nepali, English, Maithili", 4.8, 92, 480, "Gynecologist focused on women's reproductive health, PCOS and menstrual disorders."),
            (DoctorIds[1].userId, DoctorIds[1].doctorId, "Dr. Sabina Shrestha", "dr.sabina@demo.np", "+977-9851001002", "Obstetrician", "MBBS, MD (Obstetrics)", 15, "Paropakar Maternity & Women's Hospital", "Kathmandu", 1500, "Nepali, English", 4.9, 140, 620, "Senior obstetrician with expertise in high-risk pregnancy and safe deliveries."),
            (DoctorIds[2].userId, DoctorIds[2].doctorId, "Dr. Binod Yadav", "dr.binod@demo.np", "+977-9851001003", "General Physician", "MBBS", 8, "Patan Hospital", "Lalitpur", 750, "Nepali, English, Hindi", 4.5, 65, 300, "General physician handling primary care, fever management and health checkups."),
            (DoctorIds[3].userId, DoctorIds[3].doctorId, "Dr. Ritu Singh", "dr.ritu@demo.np", "+977-9851001004", "Pediatrician", "MBBS, MD (Pediatrics)", 10, "Ishan Children & Women's Hospital", "Kathmandu", 1000, "Nepali, English", 4.7, 80, 410, "Pediatrician caring for newborns and children, including immunization guidance."),
            (DoctorIds[4].userId, DoctorIds[4].doctorId, "Dr. Maya Gurung", "dr.maya@demo.np", "+977-9851001005", "Psychiatrist", "MBBS, MD (Psychiatry)", 9, "Clinic One", "Lalitpur", 1800, "Nepali, English", 4.6, 54, 260, "Mental health specialist supporting women through anxiety, depression and life changes."),
            (DoctorIds[5].userId, DoctorIds[5].doctorId, "Dr. Puja Karki", "dr.puja@demo.np", "+977-9851001006", "Nutritionist", "B.Sc. Nutrition, M.Sc. Clinical Nutrition", 6, "Mithila Nursing Home", "Janakpur", 600, "Nepali, Maithili, English", 4.4, 40, 190, "Clinical nutritionist designing diet plans for pregnancy and menstrual health.")
        };

        var doctors = doctorDefs.Select(d => new Doctor
        {
            Id = d.doctorId, Name = d.name, Email = d.email, Specialization = d.spec,
            Qualifications = d.quals, ExperienceYears = d.exp, ConsultationFee = d.fee,
            Languages = d.langs, About = $"{d.bio} Practices at {d.hospital}, {d.city}.",
            AvailabilityJson = availability, IsAvailable = true,
            TotalConsultations = d.consults, RatingAverage = d.rating, RatingCount = d.ratings
        }).ToList();
        db.Doctors.AddRange(doctors);

        db.Users.AddRange(doctorDefs.Select(d => new User
        {
            Id = d.userId, Name = d.name, Email = d.email, Phone = d.phone,
            Role = UserRole.Doctor, DoctorId = d.doctorId, PasswordHash = hash, Language = "english"
        }));

        // ---- Period cycles for Sita (6 past cycles, avg ~29 days) ----
        var cycleDefs = new (int daysAgo, int duration, string flow)[]
        {
            (175, 5, "light"), (145, 5, "medium"), (117, 6, "medium"),
            (88, 5, "heavy"), (58, 5, "medium"), (28, 6, "medium")
        };
        db.PeriodCycles.AddRange(cycleDefs.Select(c => new PeriodCycle
        {
            UserId = Sita,
            StartDate = Ago(c.daysAgo),
            EndDate = Ago(c.daysAgo - c.duration + 1),
            FlowLevel = c.flow,
            PainLevel = c.flow == "heavy" ? 7 : c.flow == "medium" ? 5 : 3
        }));

        // ---- Pregnancy for Gita (LMP 20 weeks ago) + logs ----
        var lmp = Ago(20 * 7);
        var pregnancy = new Pregnancy
        {
            UserId = Gita, LmpDate = lmp, DueDate = lmp.AddDays(280), IsActive = true,
            Notes = "Second pregnancy. Prior normal delivery."
        };
        db.Pregnancies.Add(pregnancy);
        db.PregnancyLogs.AddRange(new[]
        {
            new PregnancyLog { PregnancyId = pregnancy.Id, UserId = Gita, LogDate = Ago(11), LogType = "weight", Value = "62.5", Notes = "mild back pain" },
            new PregnancyLog { PregnancyId = pregnancy.Id, UserId = Gita, LogDate = Ago(7), LogType = "weight", Value = "63.0" },
            new PregnancyLog { PregnancyId = pregnancy.Id, UserId = Gita, LogDate = Ago(4), LogType = "bp", Value = "110/72", Notes = "swollen feet" },
            new PregnancyLog { PregnancyId = pregnancy.Id, UserId = Gita, LogDate = Ago(2), LogType = "kick", Value = "active", Notes = "heartburn" }
        });

        // ---- Appointments + consultation chat for Sita ----
        var anitaDoctorId = DoctorIds[0].doctorId;
        var sabinaDoctorId = DoctorIds[1].doctorId;

        var completedAppt = new Appointment
        {
            PatientId = Sita, DoctorId = anitaDoctorId, ScheduledDate = Ago(10), ScheduledTime = "10:00-11:00",
            Status = AppointmentStatus.Completed, Reason = "Irregular periods and cramps",
            ConsultationNotes = "Prescribed iron tablets. Advised warm compress for cramps. Follow-up in 3 months."
        };
        var acceptedAppt = new Appointment
        {
            PatientId = Sita, DoctorId = anitaDoctorId, ScheduledDate = Ahead(3), ScheduledTime = "11:00-12:00",
            Status = AppointmentStatus.Accepted, Reason = "Follow-up on period pain"
        };
        var pendingAppt = new Appointment
        {
            PatientId = Sita, DoctorId = sabinaDoctorId, ScheduledDate = Ahead(6), ScheduledTime = "10:00-11:00",
            Status = AppointmentStatus.Pending, Reason = "Annual women's health checkup"
        };
        db.Appointments.AddRange(completedAppt, acceptedAppt, pendingAppt);

        var chat = new ConsultationChat { AppointmentId = acceptedAppt.Id, IsActive = true, StartedAt = now.AddDays(-5) };
        db.ConsultationChats.Add(chat);
        var sitaName = sita.Name;
        var anitaName = doctors[0].Name;
        db.ConsultationMessages.AddRange(new[]
        {
            new ConsultationMessage { ChatId = chat.Id, SenderType = MessageSenderType.User, SenderId = Sita, SenderName = sitaName, Content = "Namaste Doctor. I had bad cramps this month.", SentAt = now.AddDays(-5).AddMinutes(2) },
            new ConsultationMessage { ChatId = chat.Id, SenderType = MessageSenderType.User, SenderId = Sita, SenderName = sitaName, Content = "Is taking mefenamic acid once safe with ibuprofen?", SentAt = now.AddDays(-5).AddMinutes(4) },
            new ConsultationMessage { ChatId = chat.Id, SenderType = MessageSenderType.Doctor, SenderId = anitaDoctorId, SenderName = anitaName, Content = "Namaste Sita. With food, one tablet is fine, but do not combine both without advice.", SentAt = now.AddDays(-5).AddMinutes(30) },
            new ConsultationMessage { ChatId = chat.Id, SenderType = MessageSenderType.Doctor, SenderId = anitaDoctorId, SenderName = anitaName, Content = "Let us meet on Thursday to review. Note down your pain days meanwhile.", SentAt = now.AddDays(-5).AddMinutes(31) }
        });

        // ---- Health chat for Sita ----
        var healthChat = new HealthChat { UserId = Sita, Title = "Early period question" };
        db.HealthChats.Add(healthChat);
        db.HealthChatMessages.AddRange(new[]
        {
            new HealthChatMessage { ChatId = healthChat.Id, Role = "user", Content = "My period came 5 days early this month, should I worry?", CreatedAt = now.AddDays(-20) },
            new HealthChatMessage { ChatId = healthChat.Id, Role = "assistant", Content = "An occasional early cycle of 2\u20134 days is common and linked to stress or sleep. This is general information, not medical advice. Please consult a health worker.", CreatedAt = now.AddDays(-20).AddSeconds(2) }
        });

        // ---- Emergency contacts for Sita ----
        db.EmergencyContacts.AddRange(new[]
        {
            new EmergencyContact { UserId = Sita, Name = "Kamala Yadav", Phone = "+977-9801234501", Relation = "mother" },
            new EmergencyContact { UserId = Sita, Name = "Sunita Chaudhary", Phone = "+977-9801234502", Relation = "friend" }
        });

        // ---- SOS history (resolved) ----
        db.SosAlerts.AddRange(new[]
        {
            new SosAlert { UserId = Sita, UserName = sitaName, Latitude = 26.7285, Longitude = 85.9265, LocationLabel = "Near Mahendranagar Chowk, Janakpur", Status = SosStatus.Resolved, CreatedAt = now.AddDays(-3), ResolvedAt = now.AddDays(-3).AddHours(1), ContactsNotifiedJson = "[{\"name\":\"Kamala Yadav\",\"phone\":\"+977-9801234501\"}]" },
            new SosAlert { UserId = Sita, UserName = sitaName, Latitude = 26.7412, Longitude = 85.9117, LocationLabel = "Janakpur Road, Dhanusha", Message = "Feeling dizzy, at the market.", Status = SosStatus.Resolved, CreatedAt = now.AddDays(-9), ResolvedAt = now.AddDays(-9).AddHours(2), ContactsNotifiedJson = "[]" }
        });

        // ---- Community posts ----
        var postDefs = new (string? name, string text, bool anon, int daysAgo)[]
        {
            ("Kamala Thapa", "Any tips for morning nausea in the first trimester? Ginger tea helps me a little.", false, 6),
            (null, "Has anyone tried yoga for period cramps? My doctor recommended child pose.", true, 5),
            ("Rina Das", "Where can I get the rubella vaccine in Janakpur? Asking for my younger sister.", false, 5),
            ("Maya Chaudhary", "Iron tablets make me constipated. What helped you?", false, 4),
            (null, "Feeling anxious about the delivery next month. Any encouraging stories welcome.", true, 3),
            ("Sunita Bhatt", "My baby kick counts dropped yesterday but the ultrasound was fine. Keep counting daily!", false, 2),
            ("Rekha Mandal", "Free checkup camp at Mithila Nursing Home this Saturday, sharing for everyone.", false, 2),
            (null, "Is delayed period due to travel normal? I flew to Kathmandu last week.", true, 1)
        };
        var posts = postDefs.Select(p => new CommunityPost
        {
            UserId = p.anon ? null : Sita,
            AuthorName = p.anon ? "Anonymous" : p.name!,
            Title = p.text.Length > 60 ? p.text[..57] + "..." : p.text,
            Content = p.text,
            Category = "general",
            IsAnonymous = p.anon,
            CreatedAt = now.AddDays(-p.daysAgo),
            UpdatedAt = now.AddDays(-p.daysAgo)
        }).ToList();
        db.CommunityPosts.AddRange(posts);
        foreach (var post in posts)
        {
            db.PostComments.Add(new PostComment { PostId = post.Id, UserId = null, AuthorName = "Dr. Community Helper", Content = "Wishing you well! Tea, rest and hydration help \u2014 see a nurse if it gets worse.", CreatedAt = post.CreatedAt.AddHours(12) });
            for (var i = 0; i < (post.Content.Length % 9) + 2; i++)
                db.PostLikes.Add(new PostLike { PostId = post.Id, UserId = Guid.NewGuid(), CreatedAt = post.CreatedAt.AddHours(i) });
        }

        // ---- Reports (1 open, 1 dismissed) ----
        db.PostReports.AddRange(new[]
        {
            new PostReport { PostId = posts[1].Id, ReportedByUserId = Sita, Reason = "This post looks like spam or an advertisement.", Status = ReportStatus.Open, CreatedAt = now.AddDays(-4) },
            new PostReport { PostId = posts[3].Id, ReportedByUserId = Sita, Reason = "Sharing personal information without consent.", Status = ReportStatus.Dismissed, CreatedAt = now.AddDays(-3) }
        });

        // ---- Notifications ----
        db.Notifications.AddRange(new[]
        {
            new Notification { UserId = Sita, Type = NotificationType.Appointment, Title = "Appointment confirmed", Message = "Dr. Anita Chaudhary confirmed your consultation.", RelatedId = acceptedAppt.Id.ToString(), CreatedAt = now.AddDays(-5) },
            new Notification { UserId = Sita, Type = NotificationType.Appointment, Title = "Appointment completed", Message = "Your consultation notes from Dr. Anita Chaudhary are ready.", RelatedId = completedAppt.Id.ToString(), CreatedAt = now.AddDays(-10), IsRead = true },
            new Notification { UserId = Sita, Type = NotificationType.System, Title = "Welcome to SathiCare", Message = "Track your cycle, talk to Saathi AI and find care near you.", CreatedAt = now.AddDays(-30), IsRead = true },
            new Notification { UserId = Sita, Type = NotificationType.Community, Title = "New reply", Message = "Dr. Community Helper replied to a post you follow.", CreatedAt = now.AddDays(-2) },
            new Notification { UserId = Gita, Type = NotificationType.System, Title = "Week 20", Message = "Your pregnancy timeline has been updated. Check this week's tips.", CreatedAt = now.AddDays(-1) },
            new Notification { UserId = DoctorIds[0].userId, Type = NotificationType.Appointment, Title = "New appointment request", Message = "Sita Kumari Yadav requested a follow-up consultation.", RelatedId = acceptedAppt.Id.ToString(), CreatedAt = now.AddDays(-5) }
        });

        await db.SaveChangesAsync();
    }
}
