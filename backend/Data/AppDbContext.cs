using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using TestScriptTracker.Models.Domain;
using TestScriptTracker.Repositories.Interface;
using TestScriptTracker.Shared.Authorization;
using Newtonsoft.Json;
using Action = TestScriptTracker.Models.Domain.Action;
using TestScriptTracker.Models.DTO.Team;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc;
using TestScriptTracker.Models.CombinedModels;

namespace TestScriptTracker.Data
{
    public class AppDbContext : IdentityDbContext<AppUser, Role, Guid>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public AppDbContext(DbContextOptions<AppDbContext> options, IHttpContextAccessor httpContextAccessor) : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public DbSet<User> User { get; set; }
        public DbSet<RegistrationStatus> RegistrationStatus { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<ClientRepresentative> ClientRepresentatives { get; set; }
        public DbSet<Theme> Themes { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Phase> Phases { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Region> Regions { get; set; }
        public DbSet<ColourScheme> ColourSchemes { get; set; }
        public DbSet<Font> Fonts { get; set; }
        public DbSet<Logo> Logos { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<NotificationType> NotificationTypes { get; set; }
        public DbSet<Help> Help { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<AuditLog> AuditLog { get; set; }
        public DbSet<Models.Domain.Action> Action { get; set; }
        public DbSet<DownloadReportHistory> DownloadReportHistory { get; set; }
        public DbSet<TestScript> TestScripts { get; set; }
        public DbSet<StatusType> StatusTypes { get; set; }
        public DbSet<Status> Statuses { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<TagType> TagTypes { get; set; }
        public DbSet<TestScriptTags> TestScriptTags { get; set; }
        public DbSet<Defect> Defects { get; set; }
        public DbSet<DefectStatus> DefectStatus { get; set; }
        public DbSet<Template> Templates { get; set; }
        public DbSet<TemplateStatus> TemplateStatus { get; set; }
        public DbSet<TemplateTestStep> TemplateTestSteps { get; set; }
        public DbSet<TestStep> TestSteps { get; set; }
        public DbSet<StepResult> StepResults { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<TeamMembers> TeamMembers { get; set; }
        public DbSet<ScheduleEvent> ScheduleEvents { get; set; }
        public DbSet<TestScriptAssignment> TestScriptAssignments { get; set; }
        public DbSet<HelpPage> HelpPage { get; set; }

        public DbSet<EventParticipants> EventParticipants { get; set; }


        public DbSet<Action> Actions { get; set; }
        //  public DbSet<ScheduleEventTeam> ScheduleEventTeams { get; set; }

        //Identity User Table
        public DbSet<AppUser> AppUsers { get; set; }

        //nosipho-audit
        public override int SaveChanges()
        {
            HandleSoftDelete();
            OnBeforeSaveChanges();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                HandleSoftDelete();
                OnBeforeSaveChanges();
                
                return await base.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateException ex)
            {
                var innerException = ex.InnerException?.Message ?? ex.Message;
                Console.WriteLine($"An error occurred while saving the entity changes: {innerException}");
                throw new Exception($"An error occurred while saving the entity changes: {innerException}", ex);
            }
        }

        private void OnBeforeSaveChanges()
        {
            var auditEntries = new List<AuditLog>();
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.State == EntityState.Added || entry.State == EntityState.Modified || entry.State == EntityState.Deleted)
                {
                    var actionId = GetActionId(entry.State);
                    var actionName = this.Action.FirstOrDefault(a => a.ActionId == actionId)?.ActionName;

                    var auditEntry = new AuditLog
                    {

                        UserId = !string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var parsedUserId) ? parsedUserId : (Guid?)null,
                        //UserId = userId,
                        TableName = entry.Entity.GetType().Name,
                        TimeStamp = DateTime.UtcNow,
                        ActionId = actionId,
                        Type = actionName,
                        PrimaryKey = GetPrimaryKeyValue(entry),
                        OldValues = entry.State == EntityState.Modified || entry.State == EntityState.Deleted ? SerializeObject(entry.OriginalValues.Properties.ToDictionary(p => p.Name, p => entry.OriginalValues[p])) : null,
                        NewValues = entry.State == EntityState.Added || entry.State == EntityState.Modified ? SerializeObject(entry.CurrentValues.Properties.ToDictionary(p => p.Name, p => entry.CurrentValues[p])) : null,
                        AffectedColumns = SerializeObject(entry.Properties.Where(p => p.IsModified).Select(p => p.Metadata.Name).ToList())
                    };

                    auditEntries.Add(auditEntry);
                }
            }

            if (auditEntries.Any())
            {
                AuditLog.AddRange(auditEntries);
            }
        }

        private string GetUserId()
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            return !string.IsNullOrEmpty(userId) ? userId : "Anonymous"; 
        }

        private int GetActionId(EntityState state)
        {
            return state switch
            {
                EntityState.Added => 1, // Assuming 1 is for Create
                EntityState.Modified => 2, // Assuming 2 is for Update
                EntityState.Deleted => 3, // Assuming 3 is for Delete
                _ => throw new ArgumentOutOfRangeException()
            };
        }

        private Guid GetOrGenerateUserId()
        {
            // Try to get user ID from HttpContext
            var userIdString = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            // If user ID is null or not a valid GUID, generate a new one
            if (!Guid.TryParse(userIdString, out var userId))
            {
                userId = Guid.NewGuid(); // Generates a new GUID if no user is logged in
            }

            return userId;
        }


        private string GetPrimaryKeyValue(EntityEntry entry)
        {
            var key = entry.Properties.First(p => p.Metadata.IsPrimaryKey());
            return key.CurrentValue.ToString();
        }

        private string SerializeObject(object obj)
        {
            return obj != null ? JsonConvert.SerializeObject(obj) : null;
        }

        private void HandleSoftDelete()
        {
            foreach (var entry in ChangeTracker.Entries<ISoftDelete>())
            {
                if (entry.State == EntityState.Deleted)
                {
                    entry.State = EntityState.Modified;
                    entry.Entity.IsDeleted = true;
                }
            }
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //Change ASP.NET tables to use custom names
            builder.Entity<AppUser>(entity =>
            {
                entity.ToTable("Users");
            });

            builder.Entity<Role>(entity =>
            {
                entity.ToTable("Roles");
            });

            builder.Entity<IdentityUserRole<Guid>>(entity =>
            {
                entity.ToTable("UserRoles");
            });

            builder.Entity<IdentityUserClaim<Guid>>(entity =>

            {
                entity.ToTable("UserClaims");
            });

            builder.Entity<IdentityUserLogin<Guid>>(entity =>
            {
                entity.ToTable("UserLogins");
            });

            builder.Entity<IdentityRoleClaim<Guid>>(entity =>
            {
                entity.ToTable("RoleClaims");
            });

            builder.Entity<IdentityUserToken<Guid>>(entity =>
            {
                entity.ToTable("UserTokens");
            });


            // Configure the one-to-one relationship between User and ClientRepresentative
            builder.Entity<AppUser>()
                .HasOne(u => u.ClientRepresentative)
                .WithOne(cr => cr.User)
                .HasForeignKey<ClientRepresentative>(cr => cr.UserId);

            // Configure the many-to-many relationships:

            //Role and Permission: RolePermission table (Many to Many)
            builder.Entity<RolePermission>()
                        .HasKey(rp => new { rp.RoleId, rp.PermissionId });

            builder.Entity<RolePermission>()
                .HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermissions)
                .HasForeignKey(rp => rp.RoleId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<RolePermission>()
                .HasOne(rp => rp.Permission)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(rp => rp.PermissionId)
                .OnDelete(DeleteBehavior.NoAction);

            //TestScript and Tag: TestScriptTags table (many to many)
            builder.Entity<TestScriptTags>()
                .HasKey(t => new { t.TestScriptId, t.TagId });

            builder.Entity<TestScriptTags>()
                .HasOne(t => t.TestScript)
                .WithMany(r => r.TestScriptTags)
                .HasForeignKey(f => f.TestScriptId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<TestScriptTags>()
                .HasOne(t => t.Tag)
                .WithMany(t => t.TestScriptTags)
                .HasForeignKey(t => t.TagId)
                .OnDelete(DeleteBehavior.NoAction);

            //Team and User: TeamMembers table (many to many)
            builder.Entity<TeamMembers>()
                .HasKey(t => new { t.TeamId, t.UserId });

            builder.Entity<TeamMembers>()
                .HasOne(t => t.Team)
                .WithMany(tm => tm.TeamMembers)
                .HasForeignKey(t => t.TeamId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<TeamMembers>()
                .HasOne(t => t.User)
                .WithMany(t => t.TeamMembers)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            //TestScript and TeamMembers: TestScriptAssignment (many to many)
            builder.Entity<TestScriptAssignment>()
                .HasKey(tsa => new { tsa.TestScriptId, tsa.TeamId, tsa.UserId });

            builder.Entity<TestScriptAssignment>()
                .HasOne(tsa => tsa.TestScript)
                .WithMany(ts => ts.TestScriptAssignment)
                .HasForeignKey(tsa => tsa.TestScriptId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<TestScriptAssignment>()
                .HasOne(tsa => tsa.TeamMembers)
                .WithMany(tm => tm.TestScriptAssignment)
                .HasForeignKey(tsa => new { tsa.TeamId, tsa.UserId })
                .OnDelete(DeleteBehavior.NoAction);

            //Nosipho 
            builder.Entity<Help>()
          .HasKey(h => h.HelpId);


            builder.Entity<Notification>(entity =>
            {
                entity.HasOne(n => n.Users)
                .WithMany()
                .HasForeignKey(n => n.Id)
                .HasConstraintName("FK_Notifications_Users");

                entity.HasOne(n => n.NotificationType)
                .WithMany(nt => nt.Notifications)
                .HasForeignKey(n => n.NotificationTypeId);
            });

            builder.Entity<ScheduleEvent>()
                .HasMany(e => e.EventParticipants)
                .WithOne(ep => ep.ScheduleEvent)
                .HasForeignKey(ep => ep.ScheduleEventId);

            builder.Entity<AppUser>()
                .HasMany(u => u.EventParticipants)
                .WithOne(ep => ep.User)
                .HasForeignKey(ep => ep.UserId);

            //nosipho-audit log 
            // Configuring the Action-AuditLog relationship
            builder.Entity<AuditLog>()
                .HasOne(al => al.Action)
                .WithMany(a => a.AuditLogs)
                .HasForeignKey(al => al.ActionId);

            // Seed the Action table with predefined actions
            builder.Entity<Action>().HasData(
                new Action { ActionId = 1, ActionName = "Create" },
                new Action { ActionId = 2, ActionName = "Update" },
                new Action { ActionId = 3, ActionName = "Delete" }
            );


            // Seed the permissions enum values
            var permissions = Enum.GetValues(typeof(Permissions))
                .Cast<Permissions>()
                .Select(e => new Permission
                {
                    PermissionId = Guid.NewGuid(),
                    PermissionName = e.ToString(),
                    PermissionDescription = PermissionDescriptions.Descriptions[e]
                })
                .ToList();

            builder.Entity<Permission>().HasData(permissions);


            //Create Super Admin and Admin Role

            var superAdminRoleId = Guid.NewGuid();
            var testerRoleId = Guid.NewGuid();
            var developerRoleId = Guid.NewGuid();
            var coreUserId = Guid.NewGuid();
            var auditorRoleId = Guid.NewGuid();

            var roles = new List<Role>
            {
                new Role()
                {
                    Id = superAdminRoleId,
                    Name = "SuperAdmin",
                    NormalizedName = "SuperAdmin".ToUpper(),
                    RoleDescription = "Access Control configuration for Super Admin",
                    ConcurrencyStamp = superAdminRoleId.ToString(),
                    IsDeleted = false
                },

                new Role()
                {
                    Id = testerRoleId,
                    Name = "Tester",
                    NormalizedName = "Tester".ToUpper(),
                    RoleDescription = "Access Control configuration for Testers",
                    ConcurrencyStamp = testerRoleId.ToString(),
                    IsDeleted = false
                },

                new Role()
                {
                    Id = developerRoleId,
                    Name = "Developer",
                    NormalizedName = "Developer".ToUpper(),
                    RoleDescription = "Access Control configuration for Developers",
                    ConcurrencyStamp = developerRoleId.ToString(),
                    IsDeleted = false
                },

                new Role()
                {
                    Id = coreUserId,
                    Name = "CoreUser",
                    NormalizedName = "CoreUser".ToUpper(),
                    RoleDescription = "Access Control configuration for Core Users",
                    ConcurrencyStamp = coreUserId.ToString(),
                    IsDeleted = false
                },

                new Role()          
                {
                    Id = auditorRoleId,
                    Name = "Auditor",
                    NormalizedName = "Auditor".ToUpper(),
                    RoleDescription = "Access Control configuration for System Auditors",
                    ConcurrencyStamp= auditorRoleId.ToString(),
                    IsDeleted = false
                }
            };
            //Seed the roles
            builder.Entity<Role>().HasData(roles);


            //Create a SuperAdmin User
            var superAdminId = Guid.NewGuid();
            var superAdmin = new AppUser()
            {
                Id = superAdminId,
                UserFirstName = "Carlton",
                UserSurname = "Banks",
                UserIDNumber = "0205086094083",
                UserContactNumber = "0124567899",
                UserName = "SuperAdmin500",
                Email = "super@tst.com",
                UserEmailAddress = "super@tst.com",
                NormalizedEmail = "super@tst.com".ToUpper(),
                NormalizedUserName = "SuperAdmin500".ToUpper(),
                //PasswordHashExpiration = null,
                RegistrationDate = DateTime.Now,
                RegistrationCode = "SARTX",
                //TemplateCreation = "None",
                IsDeleted = false,
                SecurityStamp = Guid.NewGuid().ToString(),
                RegStatusId = 4

            };

            superAdmin.PasswordHash = new PasswordHasher<AppUser>().HashPassword(superAdmin, "Super@123");


            //USER (Tumelo)
            var firstUserId = Guid.NewGuid();
            var firstUser = new AppUser()
            {
                Id = firstUserId,
                UserFirstName = "Tumelo",
                UserSurname = "Mogano",
                UserIDNumber = "0205086094083",
                UserContactNumber = "0124567899",
                UserName = "TumeloMogano105",
                Email = "u21496529@tuks.co.za",
                UserEmailAddress = "u21496529@tuks.co.za",
                NormalizedEmail = "u21496529@tuks.co.za".ToUpper(),
                NormalizedUserName = "TumeloMogano105".ToUpper(),
                //PasswordHashExpiration = null,
                RegistrationDate = DateTime.Now,
                RegistrationCode = "10050",
                //TemplateCreation = "None",
                IsDeleted = false,
                SecurityStamp = Guid.NewGuid().ToString(),
                RegStatusId = 4
                
            };

            firstUser.PasswordHash = new PasswordHasher<AppUser>().HashPassword(firstUser, "TumeloM@123");

            //USER (Kamogelo)
            var secondUserId = Guid.NewGuid();
            var secondUser = new AppUser()
            {
                Id = secondUserId,
                UserFirstName = "Kamogelo",
                UserSurname = "Malatsi",
                UserIDNumber = "0205086094083",
                UserContactNumber = "0622383477",
                UserName = "KamogeloMalatsi551",
                Email = "u21486507@tuks.co.za",
                UserEmailAddress = "u21486507@tuks.co.za",
                NormalizedEmail = "u21486507@tuks.co.za".ToUpper(),
                NormalizedUserName = "KamogeloMalatsi551".ToUpper(),
                //PasswordHashExpiration = null,
                RegistrationDate = DateTime.Now,
                RegistrationCode = "LLR45",
                //TemplateCreation = "None",
                IsDeleted = false,
                SecurityStamp = Guid.NewGuid().ToString(),
                RegStatusId = 4

            };

            secondUser.PasswordHash = new PasswordHasher<AppUser>().HashPassword(secondUser, "KamogeloM@123");

            //USER (Ismail)
            var thirdUserId = Guid.NewGuid();
            var thirdUser = new AppUser()
            {
                Id = thirdUserId,
                UserFirstName = "Ismail",
                UserSurname = "Carim",
                UserIDNumber = "0205086094083",
                UserContactNumber = "0729790966",
                UserName = "IsmailCarim012",
                Email = "u21429032@tuks.co.za",
                UserEmailAddress = "u21429032@tuks.co.za",
                NormalizedEmail = "u21429032@tuks.co.za".ToUpper(),
                NormalizedUserName = "IsmailCarim012".ToUpper(),
                //PasswordHashExpiration = null,
                RegistrationDate = DateTime.Now,
                RegistrationCode = "3GH51",
                //TemplateCreation = "None",
                IsDeleted = false,
                SecurityStamp = Guid.NewGuid().ToString(),
                RegStatusId = 4

            };

            thirdUser.PasswordHash = new PasswordHasher<AppUser>().HashPassword(thirdUser, "IsmailC@123");

            //USER (Nosipho)
            var fourthUserId = Guid.NewGuid();
            var fourthUser = new AppUser()
            {
                Id = fourthUserId,
                UserFirstName = "Nosipho",
                UserSurname = "Zwane",
                UserIDNumber = "0205086094083",
                UserContactNumber = "0614078955",
                UserName = "NosiphoZwane992",
                Email = "u21438383@tuks.co.za",
                UserEmailAddress = "u21438383@tuks.co.za",
                NormalizedEmail = "u21438383@tuks.co.za".ToUpper(),
                NormalizedUserName = "NosiphoZwane992".ToUpper(),
                //PasswordHashExpiration = null,
                RegistrationDate = DateTime.Now,
                RegistrationCode = "NZ020",
                //TemplateCreation = "None",
                IsDeleted = false,
                SecurityStamp = Guid.NewGuid().ToString(),
                RegStatusId = 4

            };

            fourthUser.PasswordHash = new PasswordHasher<AppUser>().HashPassword(fourthUser, "NosiphoZ@123");

            //USER (Lerato)
            var fifthUserId = Guid.NewGuid();
            var fifthUser = new AppUser()
            {
                Id = fifthUserId,
                UserFirstName = "Lerato",
                UserSurname = "Fani",
                UserIDNumber = "0205086094083",
                UserContactNumber = "0633621013",
                UserName = "LeratoFani355",
                Email = "u21555070@tuks.co.za",
                UserEmailAddress = "u21555070@tuks.co.za",
                NormalizedEmail = "u21555070@tuks.co.za".ToUpper(),
                NormalizedUserName = "LeratoFani355".ToUpper(),
                //PasswordHashExpiration = null,
                RegistrationDate = DateTime.Now,
                RegistrationCode = "LF402",
                //TemplateCreation = "None",
                IsDeleted = false,
                SecurityStamp = Guid.NewGuid().ToString(),
                RegStatusId = 4

            };

            fifthUser.PasswordHash = new PasswordHasher<AppUser>().HashPassword(fifthUser, "LeratoF@123");


            builder.Entity<AppUser>().HasData(superAdmin, firstUser, secondUser, thirdUser, fourthUser, fifthUser);

            //give roles to super admin

            var UserRoles = new List<IdentityUserRole<Guid>>()
            {
                new()
                {
                    UserId = superAdminId,
                    RoleId = superAdminRoleId
                },
                new()
                {
                    UserId = superAdminId,
                    RoleId = testerRoleId
                },
                new()
                {
                    UserId = superAdminId,
                    RoleId = developerRoleId
                },
                new()
                {
                    UserId = firstUserId,
                    RoleId = coreUserId
                },
                new()
                {
                    UserId = secondUserId,
                    RoleId = coreUserId
                },
                new()
                {
                    UserId = thirdUserId,
                    RoleId = coreUserId
                },
                new()
                {
                    UserId = fourthUserId,
                    RoleId = coreUserId
                },
                new()
                {
                    UserId = fifthUserId,
                    RoleId = coreUserId
                }

            };

            builder.Entity<IdentityUserRole<Guid>>().HasData(UserRoles);

            //Seed RolePermissions for SuperAdmin
            var SApermissions = permissions
                .Where(p => p.PermissionName != Shared.Authorization.Permissions.None.ToString())
                .Select(p => new RolePermission
                {
                    RoleId = superAdminRoleId,
                    PermissionId = p.PermissionId
                })
                .ToList();

            builder.Entity<RolePermission>().HasData(SApermissions);
        }



    }
}
