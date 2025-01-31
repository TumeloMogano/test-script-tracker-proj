using System.ComponentModel.DataAnnotations;

namespace TestScriptTracker.Models.ViewModel
{
   public class CommentViewModel
{
    public string CommentTitle { get; set; } = string.Empty;
    public string CommentLine { get; set; } = string.Empty;
    public Guid TestScriptId { get; set; }
    public string UserEmail { get; set; } = string.Empty;
    public List<CommentMentionVM> Mentions { get; set; } = new List<CommentMentionVM>();
    public string NotificationTitle { get; set; }
    public string Message { get; set; }
    public int NotificationTypeID { get; set; }
    public Guid ProjectID { get; set; }
}

}
