using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SathiCare.Api.Common;
using SathiCare.Api.Data;
using SathiCare.Api.Models;
using SathiCare.Api.Repositories;

namespace SathiCare.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IServiceProvider _services;

    public AdminController(IUnitOfWork uow, IServiceProvider services)
    {
        _uow = uow;
        _services = services;
    }

    // ---------- Stats ----------
    [HttpGet("stats")]
    public async Task<IActionResult> Stats()
    {
        var users = await _uow.Users.ListAsync(_ => true);
        var doctors = await _uow.Doctors.ListAsync(_ => true);
        var appts = await _uow.Appointments.ListAsync(_ => true);
        var posts = await _uow.CommunityPosts.ListAsync(_ => true);
        var reports = await _uow.PostReports.ListAsync(_ => true);
        var sos = await _uow.SosAlerts.ListAsync(a => a.CreatedAt >= DateTime.UtcNow.AddDays(-7));

        var recent = new List<object>();
        foreach (var a in appts.OrderByDescending(x => x.CreatedAt).Take(3))
            recent.Add(new { type = "appointment", text = $"{(users.FirstOrDefault(u => u.Id == a.PatientId)?.Name ?? "A patient")} booked {(doctors.FirstOrDefault(d => d.Id == a.DoctorId)?.Name ?? "a doctor")}", createdAt = a.CreatedAt });
        foreach (var p in posts.OrderByDescending(x => x.CreatedAt).Take(2))
            recent.Add(new { type = "post", text = $"{p.AuthorName} shared: {p.Title}", createdAt = p.CreatedAt });

        return Ok(ApiResult.Ok(new
        {
            users = users.Count(u => u.Role == UserRole.User),
            doctors = doctors.Count,
            appointments = new
            {
                pending = appts.Count(a => a.Status == AppointmentStatus.Pending),
                accepted = appts.Count(a => a.Status == AppointmentStatus.Accepted),
                completed = appts.Count(a => a.Status == AppointmentStatus.Completed),
                rejected = appts.Count(a => a.Status == AppointmentStatus.Rejected),
                cancelled = appts.Count(a => a.Status == AppointmentStatus.Cancelled)
            },
            posts = posts.Count,
            openReports = reports.Count(r => r.Status == ReportStatus.Open),
            sosLast7Days = sos.Count,
            recent = recent.OrderByDescending(r => ((dynamic)r).createdAt).Take(5)
        }));
    }

    // ---------- Users ----------
    [HttpGet("users")]
    public async Task<IActionResult> Users([FromQuery] string? search)
    {
        var users = await _uow.Users.ListAsync(_ => true);
        var q = (search ?? "").Trim().ToLowerInvariant();
        var filtered = users.Where(u => string.IsNullOrEmpty(q) ||
            u.Name.ToLowerInvariant().Contains(q) || u.Email.ToLowerInvariant().Contains(q));
        return Ok(ApiResult.Ok(new
        {
            users = filtered.OrderByDescending(u => u.CreatedAt).Select(u => new
            {
                u.Id, u.Name, u.Email, role = u.Role.ToString().ToLowerInvariant(), u.IsActive, createdAt = u.CreatedAt
            })
        }));
    }

    public record UserUpdateRequest(bool IsActive);

    [HttpPut("users/{userId:guid}")]
    public async Task<IActionResult> UpdateUser(Guid userId, [FromBody] UserUpdateRequest request)
    {
        var user = await _uow.Users.GetByIdAsync(userId) ?? throw ApiException.NotFound("User not found.");
        user.IsActive = request.IsActive;
        user.UpdatedAt = DateTime.UtcNow;
        _uow.Users.Update(user);
        await _uow.SaveChangesAsync();
        return Ok(ApiResult.Ok(new { user.Id, user.IsActive }, request.IsActive ? "Account enabled" : "Account disabled"));
    }

    // ---------- Doctors ----------
    [HttpGet("doctors")]
    public async Task<IActionResult> Doctors([FromQuery] string? search)
    {
        var doctors = await _uow.Doctors.ListAsync(_ => true);
        var q = (search ?? "").Trim().ToLowerInvariant();
        var filtered = doctors.Where(d => string.IsNullOrEmpty(q) || d.Name.ToLowerInvariant().Contains(q) || d.Specialization.ToLowerInvariant().Contains(q));
        return Ok(ApiResult.Ok(new
        {
            doctors = filtered.OrderBy(d => d.Name).Select(d => new
            {
                d.Id, d.Name, d.Email, d.Specialization, d.ExperienceYears,
                fee = d.ConsultationFee, available = d.IsAvailable, d.RatingAverage, d.RatingCount
            })
        }));
    }

    public record DoctorRequest(string Name, string Email, string Specialization, int ExperienceYears, decimal ConsultationFee, string Languages);

    [HttpPost("doctors")]
    public async Task<IActionResult> AddDoctor([FromBody] DoctorRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        if (await _uow.Users.AnyAsync(u => u.Email == email) || await _uow.Doctors.AnyAsync(d => d.Email == email))
            throw ApiException.Conflict("That email is already in use.");

        var doctor = new Doctor
        {
            Name = request.Name.Trim(),
            Email = email,
            Specialization = request.Specialization,
            ExperienceYears = request.ExperienceYears,
            ConsultationFee = request.ConsultationFee,
            Languages = request.Languages,
            AvailabilityJson = """[{"day":"Sunday","slots":["10:00-11:00","11:00-12:00","14:00-15:00"]},{"day":"Monday","slots":["10:00-11:00","14:00-15:00"]},{"day":"Tuesday","slots":["10:00-11:00","14:00-15:00"]},{"day":"Wednesday","slots":["10:00-11:00","14:00-15:00"]},{"day":"Thursday","slots":["10:00-11:00","14:00-15:00"]},{"day":"Friday","slots":["10:00-11:00","14:00-15:00"]}]"""
        };
        await _uow.Doctors.AddAsync(doctor);

        // Login account for the new doctor (demo password, hashed like the seed)
        await _uow.Users.AddAsync(new User
        {
            Name = doctor.Name,
            Email = email,
            Role = UserRole.Doctor,
            DoctorId = doctor.Id,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(DemoSeeder.DemoPassword)
        });
        await _uow.SaveChangesAsync();

        return StatusCode(201, ApiResult.Ok(new { doctor.Id, doctor.Name }, $"Doctor added — login {email} / {DemoSeeder.DemoPassword}"));
    }

    public record DoctorUpdateRequest(string? Specialization, decimal? ConsultationFee, bool? Available);

    [HttpPut("doctors/{doctorId:guid}")]
    public async Task<IActionResult> UpdateDoctor(Guid doctorId, [FromBody] DoctorUpdateRequest request)
    {
        var doctor = await _uow.Doctors.GetByIdAsync(doctorId) ?? throw ApiException.NotFound("Doctor not found.");
        if (request.Specialization != null) doctor.Specialization = request.Specialization;
        if (request.ConsultationFee is { } fee) doctor.ConsultationFee = fee;
        if (request.Available is { } avail) doctor.IsAvailable = avail;
        _uow.Doctors.Update(doctor);
        await _uow.SaveChangesAsync();
        return Ok(ApiResult.Ok(new { doctor.Id, doctor.Name, doctor.Specialization, doctor.ConsultationFee, doctor.IsAvailable }, "Doctor updated"));
    }

    // ---------- Reports ----------
    [HttpGet("reports")]
    public async Task<IActionResult> Reports()
    {
        var reports = await _uow.PostReports.ListAsync(_ => true);
        var postIds = reports.Select(r => r.PostId).ToList();
        var posts = (await _uow.CommunityPosts.ListAsync(p => postIds.Contains(p.Id))).ToDictionary(p => p.Id);
        return Ok(ApiResult.Ok(new
        {
            reports = reports.Where(r => r.Status == ReportStatus.Open).OrderByDescending(r => r.CreatedAt).Select(r => new
            {
                r.Id,
                postId = r.PostId,
                postExcerpt = posts.TryGetValue(r.PostId, out var p) ? (p.Content.Length > 80 ? p.Content[..77] + "…" : p.Content) : "(post removed)",
                r.Reason,
                status = r.Status.ToString().ToLowerInvariant(),
                createdAt = r.CreatedAt
            })
        }));
    }

    public record ReportActionRequest(string Action);

    [HttpPut("reports/{reportId:guid}")]
    public async Task<IActionResult> ActOnReport(Guid reportId, [FromBody] ReportActionRequest request)
    {
        var report = await _uow.PostReports.GetByIdAsync(reportId) ?? throw ApiException.NotFound("Report not found.");
        if (request.Action == "hide")
        {
            var post = await _uow.CommunityPosts.GetByIdAsync(report.PostId);
            if (post is not null)
            {
                post.IsHidden = true;
                _uow.CommunityPosts.Update(post);
            }
            report.Status = ReportStatus.Hidden;
        }
        else
        {
            report.Status = ReportStatus.Dismissed;
        }
        _uow.PostReports.Update(report);
        await _uow.SaveChangesAsync();
        return Ok(ApiResult.Ok(null, request.Action == "hide" ? "Post hidden" : "Report dismissed"));
    }

    // ---------- SOS ----------
    [HttpGet("sos")]
    public async Task<IActionResult> SosAlerts()
    {
        var alerts = await _uow.SosAlerts.ListAsync(_ => true);
        return Ok(ApiResult.Ok(new
        {
            alerts = alerts.OrderByDescending(a => a.CreatedAt).Take(50).Select(a => new
            {
                a.Id, a.UserName,
                location = new { a.Latitude, a.Longitude, label = a.LocationLabel },
                status = a.Status.ToString().ToLowerInvariant(),
                createdAt = a.CreatedAt,
                resolvedAt = a.ResolvedAt
            })
        }));
    }

    [HttpPut("sos/{alertId:guid}/resolve")]
    public async Task<IActionResult> ResolveSos(Guid alertId)
    {
        var alert = await _uow.SosAlerts.GetByIdAsync(alertId) ?? throw ApiException.NotFound("Alert not found.");
        alert.Status = SosStatus.Resolved;
        alert.ResolvedAt = DateTime.UtcNow;
        _uow.SosAlerts.Update(alert);
        await _uow.SaveChangesAsync();
        return Ok(ApiResult.Ok(null, "Alert resolved"));
    }

    // ---------- Demo reset passthrough ----------
    [HttpPost("reset-demo")]
    public async Task<IActionResult> ResetDemo()
    {
        await using var scope = _services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await DemoSeeder.ResetAndSeedAsync(db);
        return Ok(ApiResult.Ok(new { users = 9, doctors = 6 }, "Demo data reset"));
    }
}
