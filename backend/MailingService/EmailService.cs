using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
//using System.Net.Mail;
using MailKit.Net.Smtp;



namespace TestScriptTracker.MailingService
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings emailSettings;
        public EmailService(IOptions<EmailSettings> options)
        {
            this.emailSettings = options.Value;

        }
        public async Task SendEmailAsync(MailRequest mailRequest)
        {
            try
            {
                var email = new MimeMessage();
                email.Sender = MailboxAddress.Parse(emailSettings.Email);
                email.To.Add(MailboxAddress.Parse(mailRequest.ToEmail));
                email.Subject = mailRequest.Subject;
                var builder = new BodyBuilder();
                builder.HtmlBody = mailRequest.Body;
                email.Body = builder.ToMessageBody();

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(emailSettings.Host, emailSettings.Port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(emailSettings.Email, emailSettings.Password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
            }
            catch
            {
                throw new NotImplementedException();
            }

        }

        public string GetEmailBody(string firstName, string lastName, string registrationCode)
        {
            return $@"
        <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 8px #2c2c2c; font-family: Helvetica'>
            <div style='display: flex; border-bottom: 2px solid #ff0000;'>
                <div style='width: 100%; text-align: center;'>
                    <h1 style='color: #001844;'>Test Script Tracker</h1>
                </div>
            </div>
            <div style='padding: 20px; min-height: 300px; background-size: cover; background-position: center; background-color:#000; color: white;'>
                <div style='width: 100%; margin-top: 35px; text-align: center;'>
                    <h3 style='color: white;'>Greetings {firstName} {lastName}</h3>
                    <p style='color: white;'>Please find your registration code for the Test Script Tracker application.</p>
                    <h1 style='color: #ff0000;'><b>{registrationCode}</b></h1>
                    <p style='color: white;'>Use this code to access the Test Script Tracker Application.</p>
                    <p style='color: white;'><i>This code is valid for 7 days!</i></p>
                </div>
            </div>
        </div>";
        }

        public string GetRejectContent(string name, string surname)
        {
       
            return $@"
        <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 8px #2c2c2c; font-family: Helvetica'>
            <div style='display: flex; border-bottom: 2px solid #ff0000;'>
                <div style='width: 100%; text-align: center;'>
                    <h1 style='color: #001844;'>Test Script Tracker</h1>
                </div>
            </div>
            <div style='padding: 20px; min-height: 300px; background-size: cover; background-position: center; background-color:#000; color: white;'>
                <div style='width: 100%; margin-top: 35px; text-align: center;'>
                    <h3 style='color: white;'>Greetings {name} {surname}</h3>
                    <p style='color: white;'>We regret to inform you that your request to register for the Test Script Tracker Application has been,</p>
                    <h1 style='color: #ff0000;'><b>REJECTED!</b></h1>
                    <p style='color: white;'>Please contact the administrator if you have any questions.</p>
                    <p style='color: white;'><i>Epi-Use Admin</i></p><p>Test Script Tracker Application</p>
                </div>
            </div>
        </div>";
        }

        public string RegisterClientEmail(string firstName, string lastName, string registrationCode)
        {
            return $@"
        <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 8px #2c2c2c; font-family: Helvetica'>
            <div style='display: flex; border-bottom: 2px solid #ff0000;'>
                <div style='width: 100%; text-align: center;'>
                    <h1 style='color: #001844;'>Test Script Tracker</h1>
                </div>
            </div>
            <div style='padding: 20px; min-height: 300px; background-size: cover; background-position: center; background-color:#000; color: white;'>
                <div style='width: 100%; margin-top: 35px; text-align: center;'>
                    <h3 style='color: white;'>Greetings {firstName} {lastName}</h3>
                    <p style='color: white;'>You have been added as a client representative on the Test Script Tracker application.</p>
                    <p style='color: white;'>Please find your generated password to access the application. Take note that you will be requested to reset the given password upon first access.</p>
                    <h1 style='color: #ff0000;'><b>{registrationCode}</b></h1>
                    <p style='color: white;'>We are pleased to welcome you on the Test Script Tracker application.</p>
                </div>
            </div>
        </div>";
        }

        public string GetForgotPasswordEmailBody(int resetCode)
        {
            return $@"
        <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 8px #2c2c2c; font-family: Helvetica'>
            <div style='display: flex; border-bottom: 2px solid #ff0000;'>
                <div style='width: 100%; text-align: center;'>
                    <h1 style='color: #001844;'>Test Script Tracker</h1>
                </div>
            </div>
            <div style='padding: 20px; min-height: 300px; background-size: cover; background-position: center; background-color:#000; color: white;'>
                <div style='width: 100%; margin-top: 35px; text-align: center;'>
                    <h3 style='color: white;'>Hi </h3>
                    <p style='color: white;'>Please find your forgot password otp code for the Test Script Tracker application.</p>
                    <h1 style='color: #ff0000;'><b>{resetCode}</b></h1>
                    <p style='color: white;'>Use this code to access the Test Script Tracker Application.</p>
                    <p style='color: white;'><i>This code is valid for 15 minutes!</i></p>
                </div>
            </div>
        </div>";
        }

        public string SignOffEmail(string projectName, string CRepName, DateTime? signOffDate)
        {
            return $@"
        <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 8px #2c2c2c; font-family: Helvetica'>
            <div style='display: flex; border-bottom: 2px solid #ff0000;'>
                <div style='width: 100%; text-align: center;'>
                    <h1 style='color: #001844;'>Test Script Tracker</h1>
                </div>
            </div>
            <div style='padding: 20px; min-height: 300px; background-size: cover; background-position: center; background-color:#000; color: white;'>
                <div style='width: 100%; margin-top: 35px; text-align: center;'>
                    <h3 style='color: white;'>Greetings all.</h3>
                    <p style='color: white;'>Please find attached the proof of Sign-Off for the project.</p>
                    <h1 style='color: #ff0000;'><b>{projectName}</b></h1>
                    <p style='color: white;'>Signed-Off: {signOffDate}.</p>
                    <p style='color: white;'>Signed-By: {CRepName}.</p>

                </div>
            </div>
        </div>";
        }

        //Client Email for Sign-Off Attachment
        public async Task SendAttachmentEmailAsync(AttachmentMailRequest mailRequest)
        {
            try
            {
                var email = new MimeMessage();
                email.Sender = MailboxAddress.Parse(emailSettings.Email);
                email.To.Add(MailboxAddress.Parse(mailRequest.ToEmail));
                email.Cc.Add(MailboxAddress.Parse(mailRequest.CcEmail));
                email.Subject = mailRequest.Subject;

                var builder = new BodyBuilder();
                builder.HtmlBody = mailRequest.Body;

                // Attach the PDF
                if (mailRequest.Attachment != null)
                {
                    using (var ms = new MemoryStream())
                    {
                        await mailRequest.Attachment.CopyToAsync(ms);
                        var pdfAttachment = ms.ToArray();
                        builder.Attachments.Add(mailRequest.Attachment.FileName, pdfAttachment, ContentType.Parse(mailRequest.Attachment.ContentType));
                    }
                }

                email.Body = builder.ToMessageBody();

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(emailSettings.Host, emailSettings.Port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(emailSettings.Email, emailSettings.Password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                throw new Exception("Email sending failed", ex);
            }
        }

    }
}
