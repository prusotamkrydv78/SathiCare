using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using SathiCare.Api.Data;
using SathiCare.Api.Models;

namespace SathiCare.Api.Repositories;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly AppDbContext Db;
    protected readonly DbSet<T> Set;

    public Repository(AppDbContext db)
    {
        Db = db;
        Set = db.Set<T>();
    }

    public IQueryable<T> Query() => Set.AsNoTracking();

    public async Task<T?> GetByIdAsync(object id, CancellationToken ct = default) => await Set.FindAsync(new[] { id }, ct);

    public async Task<T?> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default) =>
        await Set.FirstOrDefaultAsync(predicate, ct);

    public async Task<List<T>> ListAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken ct = default) =>
        predicate == null ? await Set.AsNoTracking().ToListAsync(ct)
                           : await Set.AsNoTracking().Where(predicate).ToListAsync(ct);

    public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default) =>
        await Set.AnyAsync(predicate, ct);

    public async Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken ct = default) =>
        predicate == null ? await Set.CountAsync(ct) : await Set.CountAsync(predicate, ct);

    public async Task AddAsync(T entity, CancellationToken ct = default) => await Set.AddAsync(entity, ct);

    public async Task AddRangeAsync(IEnumerable<T> entities, CancellationToken ct = default) => await Set.AddRangeAsync(entities, ct);

    public void Update(T entity) => Set.Update(entity);

    public void Remove(T entity) => Set.Remove(entity);

    public void RemoveRange(IEnumerable<T> entities) => Set.RemoveRange(entities);
}

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _db;
    private readonly Dictionary<Type, object> _repos = new();

    public UnitOfWork(AppDbContext db) => _db = db;

    private IRepository<T> Repo<T>() where T : class
    {
        if (_repos.TryGetValue(typeof(T), out var cached)) return (IRepository<T>)cached;
        var repo = new Repository<T>(_db);
        _repos[typeof(T)] = repo;
        return repo;
    }

    public IRepository<User> Users => Repo<User>();
    public IRepository<Doctor> Doctors => Repo<Doctor>();
    public IRepository<Appointment> Appointments => Repo<Appointment>();
    public IRepository<ConsultationChat> ConsultationChats => Repo<ConsultationChat>();
    public IRepository<ConsultationMessage> ConsultationMessages => Repo<ConsultationMessage>();
    public IRepository<PeriodCycle> PeriodCycles => Repo<PeriodCycle>();
    public IRepository<PeriodLog> PeriodLogs => Repo<PeriodLog>();
    public IRepository<Pregnancy> Pregnancies => Repo<Pregnancy>();
    public IRepository<PregnancyLog> PregnancyLogs => Repo<PregnancyLog>();
    public IRepository<EmergencyContact> EmergencyContacts => Repo<EmergencyContact>();
    public IRepository<SosAlert> SosAlerts => Repo<SosAlert>();
    public IRepository<Notification> Notifications => Repo<Notification>();
    public IRepository<CommunityPost> CommunityPosts => Repo<CommunityPost>();
    public IRepository<PostLike> PostLikes => Repo<PostLike>();
    public IRepository<PostComment> PostComments => Repo<PostComment>();
    public IRepository<PostReport> PostReports => Repo<PostReport>();
    public IRepository<Facility> Facilities => Repo<Facility>();
    public IRepository<Review> Reviews => Repo<Review>();
    public IRepository<HealthChat> HealthChats => Repo<HealthChat>();
    public IRepository<HealthChatMessage> HealthChatMessages => Repo<HealthChatMessage>();
    public IRepository<SmsLog> SmsLogs => Repo<SmsLog>();

    public Task<int> SaveChangesAsync(CancellationToken ct = default) => _db.SaveChangesAsync(ct);
}
