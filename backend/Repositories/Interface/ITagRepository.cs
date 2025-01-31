using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.Repositories.Interface
{
    public interface ITagRepository
    {
        Task<Tag> CreateTag(Tag tag);
        Task<IEnumerable<Tag>> GetAllTagsAsync();
        Task<Tag?> GetTagByIdAsync(Guid Tagid);
        Task<Tag?> UpdateTagAsync(Tag tag);
        Task<string> DeleteTagAsync(Guid TagId);
        Task<bool> HasDependenciesAsync(Guid tagId);
        Task<bool> DeleteTagsAsync(Guid tagId);
        Task<IEnumerable<TagType>> GetAllTagTypesAsync();
        Task<TestScriptTags> ApplyTag(Guid tsId, Guid tagId);
        Task<bool> RemoveAppliedTag(Guid testscriptId, Guid tagId);
        Task<IEnumerable<Tag>> GetTagByTestScript(Guid testscriptId);
    }
}
