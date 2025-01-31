using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Repositories.Interface;
using System;
using Microsoft.AspNetCore.Http.HttpResults;

namespace TestScriptTracker.Repositories.Implementation
{
    public class CommentRepository : ICommentRepository
    {
        private readonly AppDbContext dbContext;

        public CommentRepository(AppDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        public async Task<Comment> CreateComment(Comment comment)
        {
            await dbContext.Comments.AddAsync(comment);
            await dbContext.SaveChangesAsync();

            return comment;
        }

        public async Task<IEnumerable<Comment>> GetAllCommentsAsync()
        {
            return await dbContext.Comments.Where(t => t.IsDeleted == false)
                                        .ToListAsync();
        }

        public async Task<Comment?> GetCommentByIdAsync(Guid commentid)
        {
            return await dbContext.Comments
                .FirstOrDefaultAsync(x => x.CommentId == commentid && x.IsDeleted == false);

        }

        public async Task<Comment?> UpdateCommentAsync(Comment comment)
        {
            var existingComment = await dbContext.Comments.FirstOrDefaultAsync(x => x.CommentId == comment.CommentId);

            if (existingComment != null)
            {
                dbContext.Entry(existingComment).CurrentValues.SetValues(comment);
                await dbContext.SaveChangesAsync();
                return comment;
            }

            return null;
        }

        public async Task<string> DeleteCommentAsync(Guid commentid)
        {
            var existingComment = await dbContext.Comments
               .FirstOrDefaultAsync(x => x.CommentId == commentid && x.IsDeleted == false);

            if (existingComment != null)
            {
                existingComment.IsDeleted = true;
                await UpdateCommentAsync(existingComment);
                return "Delete Success";
            }

            return "Failed to Delete";
        }

    }
}
