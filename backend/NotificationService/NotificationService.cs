using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Tls;
using TestScriptTracker.Data;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Models.DTO;

namespace TestScriptTracker.NotificationService
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _dbContext;

        public NotificationService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task SendNotificationAsync(Guid Id, string title, string message, string senderName, string senderSurname) 
        {
            var notification = new Notification
            {
                Id = Id,
                NotificationTitle = title,
                Message = message,
                //this is utc which is 2 hours behind 
                // NotificationDate = DateTime.UtcNow,
                //trying to assign south african time 
                NotificationDate = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("South Africa Standard Time")),
                /*NotificationTypeId = 2,*/  // notificationTypeId,
                NotificationTypeId = 2,

                ProjectId = null, // projectId
                SenderName = senderName, 
                SenderSurname = senderSurname
            };

            _dbContext.Notifications.Add(notification);
            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                
                Console.WriteLine("An error occurred while saving changes: " + ex.Message);
                if (ex.InnerException != null)
                {
                    Console.WriteLine("Inner exception: " + ex.InnerException.Message);
                }
                throw;
            }
        }


        //new get notifications 
        public async Task<List<NotificationDto>> GetNotificationsAsync(Guid Id)
        {
            var notifications = await _dbContext.Notifications
                                                .Where(n => n.Id == Id)
                                                .ToListAsync();

            return notifications.Select(n => new NotificationDto
            {
                NotificationId = n.NotificationId,
                NotificationTitle = n.NotificationTitle,
                Message = n.Message,
                NotificationDate = n.NotificationDate,
                NotificationTypeId = n.NotificationTypeId,
                ProjectId = n.ProjectId,
                Id = n.Id,
                IsOpened = n.IsOpened,
                SenderName = n.SenderName,
                SenderSurname = n.SenderSurname
            }).ToList();
        }

        public async Task<List<NotificationDto>> SearchNotificationsAsync(string query)
        {
            var notifications = await _dbContext.Notifications
                                                .Where(n => n.NotificationTitle.Contains(query) || n.Message.Contains(query) || n.SenderName.Contains(query) || n.SenderSurname.Contains(query))
                                                .ToListAsync();

            return notifications.Select(n => new NotificationDto
            {
                NotificationId = n.NotificationId,
                NotificationTitle = n.NotificationTitle,
                Message = n.Message,
                NotificationDate = DateTime.Now,
                //NotificationDate = n.NotificationDate,
                NotificationTypeId = n.NotificationTypeId,
                ProjectId = n.ProjectId,
                Id = n.Id,
                SenderName = n.SenderName,
                SenderSurname = n.SenderSurname
            }).ToList();
        }

        public async Task<List<NotificationDto>> SearchNotificationsByUserAsync(Guid userId, string query)
        {
            var notifications = await _dbContext.Notifications
                                                .Where(n => n.Id == userId &&
                                                            (n.NotificationTitle.Contains(query) ||
                                                             n.Message.Contains(query) || n.SenderName.Contains(query) || n.SenderSurname.Contains(query)))
                                                .ToListAsync();

            return notifications.Select(n => new NotificationDto
            {
                NotificationId = n.NotificationId,
                NotificationTitle = n.NotificationTitle,
                Message = n.Message,
                NotificationDate = DateTime.Now,
                //NotificationDate = n.NotificationDate,
                NotificationTypeId = n.NotificationTypeId,
                ProjectId = n.ProjectId,
                Id = n.Id,
                SenderName = n.SenderName,
                SenderSurname = n.SenderSurname

            }).ToList();
        }


        //this update and delete should be done by administrator 
        public async Task<NotificationDto> UpdateNotificationAsync(Guid notificationId, string title, string message)
        {
            var notification = await _dbContext.Notifications.FindAsync(notificationId);
            if (notification == null)
            {
                return null;
            }

            notification.NotificationTitle = title;
            notification.Message = message;

            _dbContext.Notifications.Update(notification);
            await _dbContext.SaveChangesAsync();

            return new NotificationDto
            {
                NotificationId = notification.NotificationId,
                NotificationTitle = notification.NotificationTitle,
                Message = notification.Message,
                NotificationDate = notification.NotificationDate,
                NotificationTypeId = notification.NotificationTypeId,
                ProjectId = notification.ProjectId,
                Id = notification.Id
            };
        }

        public async Task<bool> RemoveNotificationAsync(Guid notificationId)
        {
            var notification = await _dbContext.Notifications.FindAsync(notificationId);
            if (notification == null)
            {
                return false;
            }

            _dbContext.Notifications.Remove(notification);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        //to check whether its open or not
        public async Task<bool> MarkNotificationAsOpenedAsync(Guid notificationId)
        {
            var notification = await _dbContext.Notifications.FindAsync(notificationId);
            if (notification == null)
            {
                return false;
            }

            notification.IsOpened = true;
            await _dbContext.SaveChangesAsync();
            return true;
        }

    }
}


public interface INotificationService
{
    Task SendNotificationAsync( Guid Id, string title, string message, string senderName, string senderSurname);
    Task<List<NotificationDto>> GetNotificationsAsync(Guid Id);

    Task<List<NotificationDto>> SearchNotificationsAsync(string query);

    //searching notifications according to your own userID

    Task<List<NotificationDto>> SearchNotificationsByUserAsync(Guid userId, string query);
    //this is for update and delete 

    Task<NotificationDto> UpdateNotificationAsync(Guid notificationId, string title, string message);
    Task<bool> RemoveNotificationAsync(Guid notificationId);

    Task<bool> MarkNotificationAsOpenedAsync(Guid notificationId);

}
