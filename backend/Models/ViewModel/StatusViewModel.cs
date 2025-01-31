using System.ComponentModel.DataAnnotations;

namespace TestScriptTracker.Models.ViewModel
{
    public class StatusViewModel
    {
        public string StatusName { get; set; } = string.Empty;
        public string StatusDescription { get; set; } = string.Empty;
        public int StatusTypeId { get; set; }
        public Guid ProjectId { get; set; }

    }
}
