using Microsoft.EntityFrameworkCore;
using SathiCare.Api.Models;

namespace SathiCare.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Doctor> Doctors => Set<Doctor>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<ConsultationChat> ConsultationChats => Set<ConsultationChat>();
    public DbSet<ConsultationMessage> ConsultationMessages => Set<ConsultationMessage>();
    public DbSet<PeriodCycle> PeriodCycles => Set<PeriodCycle>();
    public DbSet<PeriodLog> PeriodLogs => Set<PeriodLog>();
    public DbSet<Pregnancy> Pregnancies => Set<Pregnancy>();
    public DbSet<PregnancyLog> PregnancyLogs => Set<PregnancyLog>();
    public DbSet<EmergencyContact> EmergencyContacts => Set<EmergencyContact>();
    public DbSet<SosAlert> SosAlerts => Set<SosAlert>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<CommunityPost> CommunityPosts => Set<CommunityPost>();
    public DbSet<PostLike> PostLikes => Set<PostLike>();
    public DbSet<PostComment> PostComments => Set<PostComment>();
    public DbSet<PostReport> PostReports => Set<PostReport>();
    public DbSet<Facility> Facilities => Set<Facility>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<HealthChat> HealthChats => Set<HealthChat>();
    public DbSet<HealthChatMessage> HealthChatMessages => Set<HealthChatMessage>();
    public DbSet<SmsLog> SmsLogs => Set<SmsLog>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        base.OnModelCreating(b);

        b.Entity<User>(e =>
        {
            e.HasIndex(x => x.Email).IsUnique();
            e.Property(x => x.Email).HasMaxLength(256);
            e.Property(x => x.Name).HasMaxLength(120);
            e.Property(x => x.Role).HasConversion<string>().HasMaxLength(16);
        });

        b.Entity<Doctor>(e =>
        {
            e.HasIndex(x => x.Email).IsUnique();
            e.Property(x => x.ConsultationFee).HasColumnType("decimal(10,2)");
        });

        b.Entity<Appointment>(e =>
        {
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(16);
            e.HasIndex(x => new { x.DoctorId, x.ScheduledDate, x.ScheduledTime })
                .HasFilter("[Status] IN ('Pending','Accepted')")
                .HasDatabaseName("IX_Appointments_Doctor_Slot");
            e.HasIndex(x => x.PatientId);
            e.Property(x => x.ConsultationNotes).HasMaxLength(4000);
            e.Property(x => x.Prescription).HasMaxLength(4000);
            e.Property(x => x.Reason).HasMaxLength(1000);
        });

        b.Entity<ConsultationChat>(e =>
        {
            e.HasIndex(x => x.AppointmentId).IsUnique();
            e.HasMany(x => x.Messages).WithOne()
                .HasForeignKey(m => m.ChatId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<ConsultationMessage>(e =>
        {
            e.Property(x => x.SenderType).HasConversion<string>().HasMaxLength(12);
            e.HasIndex(x => x.ChatId);
        });

        b.Entity<PeriodCycle>(e => { e.HasIndex(x => x.UserId); });
        b.Entity<PeriodLog>(e => { e.HasIndex(x => new { x.CycleId, x.LogDate }); });

        b.Entity<Pregnancy>(e => { e.HasIndex(x => new { x.UserId, x.IsActive }); });
        b.Entity<PregnancyLog>(e => { e.HasIndex(x => x.PregnancyId); });

        b.Entity<EmergencyContact>(e =>
        {
            e.HasIndex(x => x.UserId);
            e.Property(x => x.Phone).HasMaxLength(20);
        });

        b.Entity<SosAlert>(e =>
        {
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(12);
            e.HasIndex(x => x.CreatedAt);
        });

        b.Entity<Notification>(e =>
        {
            e.Property(x => x.Type).HasConversion<string>().HasMaxLength(16);
            e.HasIndex(x => new { x.UserId, x.IsRead });
        });

        b.Entity<CommunityPost>(e =>
        {
            e.HasIndex(x => new { x.Category, x.IsHidden });
            e.Property(x => x.Content).HasMaxLength(8000);
        });

        b.Entity<PostLike>(e => { e.HasKey(x => new { x.PostId, x.UserId }); });

        b.Entity<PostReport>(e =>
        {
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(12);
            e.HasIndex(x => x.Status);
        });

        b.Entity<Facility>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(64);
        });

        b.Entity<Review>(e =>
        {
            e.HasIndex(x => x.FacilityId);
            e.Property(x => x.Rating).HasDefaultValue(5);
        });

        b.Entity<HealthChat>(e => { e.HasIndex(x => new { x.UserId, x.UpdatedAt }); });
        b.Entity<HealthChatMessage>(e => { e.HasIndex(x => x.ChatId); });
    }
}
