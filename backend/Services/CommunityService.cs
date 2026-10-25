using SathiCare.Api.Common;
using SathiCare.Api.Models;
using SathiCare.Api.Repositories;

namespace SathiCare.Api.Services;

public interface ICommunityService
{
    Task<object> ListPostsAsync(Guid? userId, string? category, string sort, int page, int pageSize);
    Task<object> CreatePostAsync(Guid userId, string title, string content, string category, bool anonymous);
    Task<object> ToggleLikeAsync(Guid userId, Guid postId);
    Task<object> AddCommentAsync(Guid userId, Guid postId, string content);
    Task ReportAsync(Guid userId, Guid postId, string reason);
    Task<object> GetPostAsync(Guid? userId, Guid postId);
}

public class CommunityService : ICommunityService
{
    private readonly IUnitOfWork _uow;

    public CommunityService(IUnitOfWork uow) => _uow = uow;

    public async Task<object> ListPostsAsync(Guid? userId, string? category, string sort, int page, int pageSize)
    {
        var posts = await _uow.CommunityPosts.ListAsync(p => !p.IsHidden);
        if (!string.IsNullOrEmpty(category) && category != "all")
            posts = posts.Where(p => p.Category == category).ToList();

        var postIds = posts.Select(p => p.Id).ToList();
        var likes = await _uow.PostLikes.ListAsync(l => postIds.Contains(l.PostId));
        var comments = await _uow.PostComments.ListAsync(c => postIds.Contains(c.PostId));

        var ordered = sort == "top"
            ? posts.OrderByDescending(p => likes.Count(l => l.PostId == p.Id)).ThenByDescending(p => p.CreatedAt)
            : posts.OrderByDescending(p => p.CreatedAt);

        var items = ordered
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(p =>
            {
                var postLikes = likes.Where(l => l.PostId == p.Id).ToList();
                return (object)new
                {
                    p.Id,
                    p.Title,
                    p.Content,
                    p.Category,
                    authorName = p.IsAnonymous ? "Anonymous" : p.AuthorName,
                    p.IsAnonymous,
                    likesCount = postLikes.Count,
                    hasLiked = userId is { } u && postLikes.Any(l => l.UserId == u),
                    commentsCount = comments.Count(c => c.PostId == p.Id),
                    createdAt = p.CreatedAt
                };
            })
            .ToList();

        return new { posts = items, page, total = posts.Count };
    }

    public async Task<object> GetPostAsync(Guid? userId, Guid postId)
    {
        var p = await _uow.CommunityPosts.GetByIdAsync(postId) ?? throw ApiException.NotFound("Post not found.");
        if (p.IsHidden) throw ApiException.NotFound("Post not found.");
        var likes = await _uow.PostLikes.ListAsync(l => l.PostId == postId);
        var comments = await _uow.PostComments.ListAsync(c => c.PostId == postId);
        return new
        {
            p.Id, p.Title, p.Content, p.Category,
            authorName = p.IsAnonymous ? "Anonymous" : p.AuthorName,
            p.IsAnonymous,
            likesCount = likes.Count,
            hasLiked = userId is { } u && likes.Any(l => l.UserId == u),
            comments = comments.OrderBy(c => c.CreatedAt).Select(c => new { c.Id, c.AuthorName, c.Content, createdAt = c.CreatedAt }),
            createdAt = p.CreatedAt
        };
    }

    public async Task<object> CreatePostAsync(Guid userId, string title, string content, string category, bool anonymous)
    {
        if (string.IsNullOrWhiteSpace(content)) throw ApiException.BadRequest("Write something first.");
        if (content.Length > 4000) throw ApiException.BadRequest("Post is too long (max 4000 characters).");
        var user = await _uow.Users.GetByIdAsync(userId) ?? throw ApiException.Unauthorized("Account not found.");

        var post = new CommunityPost
        {
            UserId = userId,
            AuthorName = user.Name,
            Title = string.IsNullOrWhiteSpace(title)
                ? (content.Length > 60 ? content[..57] + "…" : content)
                : title.Trim(),
            Content = content.Trim(),
            Category = string.IsNullOrWhiteSpace(category) ? "general" : category.Trim(),
            IsAnonymous = anonymous
        };
        await _uow.CommunityPosts.AddAsync(post);
        await _uow.SaveChangesAsync();
        return await GetPostAsync(userId, post.Id);
    }

    public async Task<object> ToggleLikeAsync(Guid userId, Guid postId)
    {
        var post = await _uow.CommunityPosts.GetByIdAsync(postId) ?? throw ApiException.NotFound("Post not found.");
        var existing = await _uow.PostLikes.FindAsync(l => l.PostId == postId && l.UserId == userId);
        if (existing is not null)
        {
            _uow.PostLikes.Remove(existing);
            await _uow.SaveChangesAsync();
        }
        else
        {
            await _uow.PostLikes.AddAsync(new PostLike { PostId = postId, UserId = userId });
            await _uow.SaveChangesAsync();
        }
        var count = await _uow.PostLikes.CountAsync(l => l.PostId == postId);
        return new { liked = existing is null, likesCount = count };
    }

    public async Task<object> AddCommentAsync(Guid userId, Guid postId, string content)
    {
        var post = await _uow.CommunityPosts.GetByIdAsync(postId) ?? throw ApiException.NotFound("Post not found.");
        if (string.IsNullOrWhiteSpace(content)) throw ApiException.BadRequest("Comment cannot be empty.");
        var user = await _uow.Users.GetByIdAsync(userId);

        var comment = new PostComment
        {
            PostId = postId,
            UserId = userId,
            AuthorName = user?.Name ?? "Anonymous",
            Content = content.Trim()
        };
        await _uow.PostComments.AddAsync(comment);
        await _uow.SaveChangesAsync();
        return new { comment.Id, comment.AuthorName, comment.Content, createdAt = comment.CreatedAt };
    }

    public async Task ReportAsync(Guid userId, Guid postId, string reason)
    {
        var post = await _uow.CommunityPosts.GetByIdAsync(postId) ?? throw ApiException.NotFound("Post not found.");
        if (string.IsNullOrWhiteSpace(reason)) throw ApiException.BadRequest("Tell us why you are reporting this post.");
        await _uow.PostReports.AddAsync(new PostReport
        {
            PostId = postId,
            ReportedByUserId = userId,
            Reason = reason.Trim()
        });
        await _uow.SaveChangesAsync();
    }
}
