using System.Linq.Expressions;
using SathiCare.Api.Models;

namespace SathiCare.Api.Repositories;

/// <summary>Generic repository over a DbSet — all controllers/services go through this, never the DbContext directly.</summary>
public interface IRepository<T> where T : class
{
    IQueryable<T> Query();
    Task<T?> GetByIdAsync(object id, CancellationToken ct = default);
    Task<T?> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
    Task<List<T>> ListAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken ct = default);
    Task<bool> AnyAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
    Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken ct = default);
    Task AddAsync(T entity, CancellationToken ct = default);
    Task AddRangeAsync(IEnumerable<T> entities, CancellationToken ct = default);
    void Update(T entity);
    void Remove(T entity);
    void RemoveRange(IEnumerable<T> entities);
}

public interface IUnitOfWork
{
    IRepository<User> Users { get; }
    IRepository<Doctor> Doctors { get; }
    IRepository<Appointment> Appointments { get; }
    IRepository<ConsultationChat> ConsultationChats { get; }
    IRepository<ConsultationMessage> ConsultationMessages { get; }
    IRepository<PeriodCycle> PeriodCycles { get; }
    IRepository<PeriodLog> PeriodLogs { get; }
    IRepository<Pregnancy> Pregnancies { get; }
    IRepository<PregnancyLog> PregnancyLogs { get; }
    IRepository<EmergencyContact> EmergencyContacts { get; }
    IRepository<SosAlert> SosAlerts { get; }
    IRepository<Notification> Notifications { get; }
    IRepository<CommunityPost> CommunityPosts { get; }
    IRepository<PostLike> PostLikes { get; }
    IRepository<PostComment> PostComments { get; }
    IRepository<PostReport> PostReports { get; }
    IRepository<Facility> Facilities { get; }
    IRepository<Review> Reviews { get; }
    IRepository<HealthChat> HealthChats { get; }
    IRepository<HealthChatMessage> HealthChatMessages { get; }
    IRepository<SmsLog> SmsLogs { get; }

    /// <summary>Persists all pending changes. Throws on unique-constraint violations (caller maps to 409).</summary>
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
