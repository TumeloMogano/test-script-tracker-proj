using System.ComponentModel.DataAnnotations;

namespace TestScriptTracker.Models.ViewModel
{
    public class TagViewModel
    {
        public string TagName { get; set; } = string.Empty;
        public string TagDescription { get; set; } = string.Empty;
        public int TagTypeId { get; set; }
    }
}
