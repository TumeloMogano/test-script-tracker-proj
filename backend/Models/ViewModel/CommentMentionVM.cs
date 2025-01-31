namespace TestScriptTracker.Models.ViewModel
{
    public class CommentMentionVM
    {
        public string CommentId { get; set; }
        public Guid UserId { get; set; }
        public string Comment { get; set; }
        public string UserEmail { get; set; }
    }

}
