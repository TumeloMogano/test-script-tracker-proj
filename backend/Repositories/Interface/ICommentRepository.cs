using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Repositories.Interface
{
    public interface ICommentRepository
    {
        Task<Comment> CreateComment(Comment comment);
        Task<IEnumerable<Comment>> GetAllCommentsAsync();
        Task<Comment?> GetCommentByIdAsync(Guid commentid);
        Task<Comment?> UpdateCommentAsync(Comment comment);
        Task<string> DeleteCommentAsync(Guid commentid);
    }
}
