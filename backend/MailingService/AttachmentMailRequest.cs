namespace TestScriptTracker.MailingService
{
    public class AttachmentMailRequest
    {
        public string ToEmail { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public IFormFile? Attachment { get; set; }
        public string CcEmail { get; set; }

    }
}
