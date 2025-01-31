using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Repositories.Interface;
using System;
using Microsoft.AspNetCore.Http.HttpResults;

namespace TestScriptTracker.Repositories.Implementation
{
    public class TagRepository : ITagRepository
    {
        private readonly AppDbContext dbContext;

        public TagRepository(AppDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        public async Task<Tag> CreateTag(Tag tag)
        {
            await dbContext.Tags.AddAsync(tag);
            await dbContext.SaveChangesAsync();

            return tag;
        }

        public async Task<IEnumerable<Tag>> GetAllTagsAsync()
        {
            return await dbContext.Tags.Where(t => t.IsDeleted == false)  
                                        .Include(t => t.TagType)
                                        .ToListAsync();
        }

        public async Task<Tag?> GetTagByIdAsync(Guid Tagid)
        {
            return await dbContext.Tags
                .FirstOrDefaultAsync(x => x.TagId == Tagid && x.IsDeleted == false);

        }

        public async Task<Tag?> UpdateTagAsync(Tag tag)
        {
            var existingTag = await dbContext.Tags.FirstOrDefaultAsync(x => x.TagId == tag.TagId);

            if (existingTag != null)
            {
                dbContext.Entry(existingTag).CurrentValues.SetValues(tag);
                await dbContext.SaveChangesAsync();
                return tag;
            }

            return null;
        }

        public async Task<string> DeleteTagAsync(Guid tagId)
        {
            var existingTag = await dbContext.Tags
               .FirstOrDefaultAsync(x => x.TagId == tagId && !x.IsDeleted);

            if (existingTag == null)
            {
                return "NotFound";
            }

            var existingTestScript = await dbContext.TestScriptTags
                .FirstOrDefaultAsync(x => x.TagId == existingTag.TagId);

            if (existingTestScript != null)
            {
                return "TagAssociated";
            }

            existingTag.IsDeleted = true;
            dbContext.Tags.Update(existingTag); // Ensure the tag is updated in the context
            await dbContext.SaveChangesAsync(); // Save changes to the database

            return "DeleteSuccess";
        }

        public async Task<IEnumerable<TagType>> GetAllTagTypesAsync()
        {
            return await dbContext.TagTypes.ToListAsync();
        }

        public async Task<TestScriptTags> ApplyTag(Guid testscriptId, Guid tagId)
        {
            //Check if test script exists
            var testscript = await dbContext.TestScripts.FindAsync(testscriptId);
            if (testscript == null)
            {
                throw new ArgumentException("Test script not found.");
            }

            //Check if the tag exists
            var tag = await dbContext.Tags.FindAsync(tagId);
            if (tag == null)
            {
                throw new ArgumentException("Tag not ");
            }

            var existingTStag = await dbContext.TestScriptTags
                .FirstOrDefaultAsync(tst => tst.TestScriptId == testscriptId && tst.TagId == tagId);

            if (existingTStag != null)
            {
                throw new InvalidOperationException("This tag has already been applied on this test script");
            }

            var testScriptTag = new TestScriptTags
            {
                TestScriptId = testscriptId,
                TagId = tagId,
                IsDeleted = false
            };

            await dbContext.TestScriptTags.AddAsync(testScriptTag);
            await dbContext.SaveChangesAsync();

            return testScriptTag;

        }

        public async Task<bool> RemoveAppliedTag(Guid testscriptId, Guid tagId)
        {
            var testScriptTag = await dbContext.TestScriptTags
                .FirstOrDefaultAsync(tst => tst.TestScriptId == testscriptId && tst.TagId == tagId);

            if (testScriptTag == null)
                throw new InvalidOperationException("Tag is not linked to testscript.");

            dbContext.TestScriptTags.Remove(testScriptTag);
            await dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<Tag>> GetTagByTestScript(Guid testscriptId)
        {
            //Check if test script exists
            var testscript = await dbContext.TestScripts.FindAsync(testscriptId);
            if (testscript == null)
            {
                throw new ArgumentException("Test script not found.");
            }

            var tags = await dbContext.TestScriptTags
                                        .Where(tst => tst.TestScriptId == testscriptId && !tst.IsDeleted)
                                        .Select(tst => tst.Tag)
                                        .ToListAsync();

            return tags;
        }

        public async Task<bool> HasDependenciesAsync(Guid tagId)
        {
            var hasDependencies = await dbContext.TestScriptTags.AnyAsync(tst => tst.TagId == tagId);

            return hasDependencies;
        }

        public async Task<bool> DeleteTagsAsync(Guid tagId)
        {
            var tag = await dbContext.Tags.FindAsync(tagId);

            if (tag == null)
            {
                return false;
            }

            dbContext.Tags.Remove(tag);
            await dbContext.SaveChangesAsync();
            return true;
        }
    }
}
