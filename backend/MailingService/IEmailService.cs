namespace TestScriptTracker.MailingService
{
    public interface IEmailService
    {
        Task SendEmailAsync(MailRequest mailRequest);
        string GetEmailBody(string firstName, string lastName, string registrationCode);
        string GetRejectContent(string name, string surname);
        string GetForgotPasswordEmailBody(int resetCode);
        string RegisterClientEmail(string firstName, string lastName, string registrationCode);
        string SignOffEmail(string projectName, string CRep, DateTime? signOffDate);
        Task SendAttachmentEmailAsync(AttachmentMailRequest mailRequest);

    }
}
