using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TestScriptTracker.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Action",
                columns: table => new
                {
                    ActionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActionName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Action", x => x.ActionId);
                });

            migrationBuilder.CreateTable(
                name: "Countries",
                columns: table => new
                {
                    CountryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CountryName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Countries", x => x.CountryId);
                });

            migrationBuilder.CreateTable(
                name: "DefectStatus",
                columns: table => new
                {
                    DefectStatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DefectStatusName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DefectStatus", x => x.DefectStatusId);
                });

            migrationBuilder.CreateTable(
                name: "Fonts",
                columns: table => new
                {
                    FontId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FontName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fonts", x => x.FontId);
                });

            migrationBuilder.CreateTable(
                name: "Help",
                columns: table => new
                {
                    HelpId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Question = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Answer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Help", x => x.HelpId);
                });

            migrationBuilder.CreateTable(
                name: "HelpPage",
                columns: table => new
                {
                    HelpPageID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Question = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Answer = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HelpPage", x => x.HelpPageID);
                });

            migrationBuilder.CreateTable(
                name: "NotificationTypes",
                columns: table => new
                {
                    NotificationTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NotificationTypeName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationTypes", x => x.NotificationTypeId);
                });

            migrationBuilder.CreateTable(
                name: "Permissions",
                columns: table => new
                {
                    PermissionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PermissionName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PermissionDescription = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permissions", x => x.PermissionId);
                });

            migrationBuilder.CreateTable(
                name: "Phases",
                columns: table => new
                {
                    PhaseId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PhaseName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PhaseDescription = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Phases", x => x.PhaseId);
                });

            migrationBuilder.CreateTable(
                name: "RegistrationStatus",
                columns: table => new
                {
                    RegStatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RegStatusName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistrationStatus", x => x.RegStatusId);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoleDescription = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StatusTypes",
                columns: table => new
                {
                    StatusTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusTypeName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StatusTypes", x => x.StatusTypeId);
                });

            migrationBuilder.CreateTable(
                name: "StepResults",
                columns: table => new
                {
                    StepResultId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StepResultName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StepResults", x => x.StepResultId);
                });

            migrationBuilder.CreateTable(
                name: "TagTypes",
                columns: table => new
                {
                    TagTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TagtypeName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TagTypes", x => x.TagTypeId);
                });

            migrationBuilder.CreateTable(
                name: "Teams",
                columns: table => new
                {
                    TeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeamName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    TeamDescription = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teams", x => x.TeamId);
                });

            migrationBuilder.CreateTable(
                name: "TemplateStatus",
                columns: table => new
                {
                    TempStatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TempStatusName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TemplateStatus", x => x.TempStatusId);
                });

            migrationBuilder.CreateTable(
                name: "Regions",
                columns: table => new
                {
                    RegionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RegionName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CountryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Regions", x => x.RegionId);
                    table.ForeignKey(
                        name: "FK_Regions_Countries_CountryId",
                        column: x => x.CountryId,
                        principalTable: "Countries",
                        principalColumn: "CountryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserFirstName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    UserSurname = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    UserIDNumber = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false),
                    UserContactNumber = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    UserEmailAddress = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RegistrationDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RegistrationCode = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    IsNewPassword = table.Column<bool>(type: "bit", maxLength: 255, nullable: true),
                    ResetCode = table.Column<int>(type: "int", nullable: true),
                    ResetCodeExpiration = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    RegStatusId = table.Column<int>(type: "int", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_RegistrationStatus_RegStatusId",
                        column: x => x.RegStatusId,
                        principalTable: "RegistrationStatus",
                        principalColumn: "RegStatusId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoleClaims_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RolePermissions",
                columns: table => new
                {
                    RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PermissionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermissions", x => new { x.RoleId, x.PermissionId });
                    table.ForeignKey(
                        name: "FK_RolePermissions_Permissions_PermissionId",
                        column: x => x.PermissionId,
                        principalTable: "Permissions",
                        principalColumn: "PermissionId");
                    table.ForeignKey(
                        name: "FK_RolePermissions_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    TagId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TagName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TagDescription = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    TagTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.TagId);
                    table.ForeignKey(
                        name: "FK_Tags_TagTypes_TagTypeId",
                        column: x => x.TagTypeId,
                        principalTable: "TagTypes",
                        principalColumn: "TagTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Templates",
                columns: table => new
                {
                    TemplateId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TemplateName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    TemplateTest = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    TemplateDescription = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    TempCreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    Feedback = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TempStatusId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Templates", x => x.TemplateId);
                    table.ForeignKey(
                        name: "FK_Templates_TemplateStatus_TempStatusId",
                        column: x => x.TempStatusId,
                        principalTable: "TemplateStatus",
                        principalColumn: "TempStatusId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Cities",
                columns: table => new
                {
                    CityId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CityName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    RegionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cities", x => x.CityId);
                    table.ForeignKey(
                        name: "FK_Cities_Regions_RegionId",
                        column: x => x.RegionId,
                        principalTable: "Regions",
                        principalColumn: "RegionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AuditLog",
                columns: table => new
                {
                    LogId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TimeStamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActionId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TableName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OldValues = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NewValues = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AffectedColumns = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrimaryKey = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLog", x => x.LogId);
                    table.ForeignKey(
                        name: "FK_AuditLog_Action_ActionId",
                        column: x => x.ActionId,
                        principalTable: "Action",
                        principalColumn: "ActionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AuditLog_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DownloadReportHistory",
                columns: table => new
                {
                    DownloadRHistId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DownloadRName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DateGenerated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DownloadReportHistory", x => x.DownloadRHistId);
                    table.ForeignKey(
                        name: "FK_DownloadReportHistory_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ScheduleEvents",
                columns: table => new
                {
                    ScheduleEventId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ScheduleEventName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    ScheduleEventDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EventTimeStart = table.Column<TimeSpan>(type: "time", nullable: false),
                    EventTimeEnd = table.Column<TimeSpan>(type: "time", nullable: false),
                    EventDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduleEvents", x => x.ScheduleEventId);
                    table.ForeignKey(
                        name: "FK_ScheduleEvents_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TeamMembers",
                columns: table => new
                {
                    TeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsTeamLead = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamMembers", x => new { x.TeamId, x.UserId });
                    table.ForeignKey(
                        name: "FK_TeamMembers_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "TeamId");
                    table.ForeignKey(
                        name: "FK_TeamMembers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserClaims_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_UserLogins_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserTokens",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_UserTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TemplateTestSteps",
                columns: table => new
                {
                    TempTestStepId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TempTestStepDescription = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    TempTestStepRole = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    TempTestStep = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TempTestStepData = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TempAdditionalInfo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    TemplateId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TemplateTestSteps", x => x.TempTestStepId);
                    table.ForeignKey(
                        name: "FK_TemplateTestSteps_Templates_TemplateId",
                        column: x => x.TemplateId,
                        principalTable: "Templates",
                        principalColumn: "TemplateId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Clients",
                columns: table => new
                {
                    ClientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClientName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    ClientEmail = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ClientNumber = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    ClientRegistrationNr = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AddressStreetNumber = table.Column<string>(type: "nvarchar(6)", maxLength: 6, nullable: false),
                    AddressStreetName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    PostalCode = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CityId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clients", x => x.ClientId);
                    table.ForeignKey(
                        name: "FK_Clients_Cities_CityId",
                        column: x => x.CityId,
                        principalTable: "Cities",
                        principalColumn: "CityId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EventParticipants",
                columns: table => new
                {
                    EventParticipantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ScheduleEventId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventParticipants", x => x.EventParticipantId);
                    table.ForeignKey(
                        name: "FK_EventParticipants_ScheduleEvents_ScheduleEventId",
                        column: x => x.ScheduleEventId,
                        principalTable: "ScheduleEvents",
                        principalColumn: "ScheduleEventId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventParticipants_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClientRepresentatives",
                columns: table => new
                {
                    ClientRepId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RepName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    RepSurname = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    RepIDNumber = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false),
                    RepContactNumber = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    RepEmailAddress = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    ClientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientRepresentatives", x => x.ClientRepId);
                    table.ForeignKey(
                        name: "FK_ClientRepresentatives_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "ClientId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClientRepresentatives_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProjectName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ProjectDescription = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    SignedOff = table.Column<bool>(type: "bit", nullable: false),
                    SignedOffDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Signature = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ResponsibleClientRep = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    ClientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    PhaseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.ProjectId);
                    table.ForeignKey(
                        name: "FK_Projects_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "ClientId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Projects_Phases_PhaseId",
                        column: x => x.PhaseId,
                        principalTable: "Phases",
                        principalColumn: "PhaseId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Projects_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "TeamId");
                });

            migrationBuilder.CreateTable(
                name: "Themes",
                columns: table => new
                {
                    ThemeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ThemeName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    FontSize = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    ClientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FontId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Themes", x => x.ThemeId);
                    table.ForeignKey(
                        name: "FK_Themes_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "ClientId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Themes_Fonts_FontId",
                        column: x => x.FontId,
                        principalTable: "Fonts",
                        principalColumn: "FontId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    NotificationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NotificationTitle = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NotificationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    NotificationTypeId = table.Column<int>(type: "int", nullable: false),
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SenderName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SenderSurname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsOpened = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.NotificationId);
                    table.ForeignKey(
                        name: "FK_Notifications_NotificationTypes_NotificationTypeId",
                        column: x => x.NotificationTypeId,
                        principalTable: "NotificationTypes",
                        principalColumn: "NotificationTypeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Notifications_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId");
                    table.ForeignKey(
                        name: "FK_Notifications_Users",
                        column: x => x.Id,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Statuses",
                columns: table => new
                {
                    StatusId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StatusName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    StatusDescription = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StatusTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Statuses", x => x.StatusId);
                    table.ForeignKey(
                        name: "FK_Statuses_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Statuses_StatusTypes_StatusTypeId",
                        column: x => x.StatusTypeId,
                        principalTable: "StatusTypes",
                        principalColumn: "StatusTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TestScripts",
                columns: table => new
                {
                    TestScriptId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Process = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Test = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    TestScriptDescription = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    DateReviewed = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Version = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsAssigned = table.Column<bool>(type: "bit", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StatusTypeId = table.Column<int>(type: "int", nullable: false),
                    TemplateId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestScripts", x => x.TestScriptId);
                    table.ForeignKey(
                        name: "FK_TestScripts_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TestScripts_StatusTypes_StatusTypeId",
                        column: x => x.StatusTypeId,
                        principalTable: "StatusTypes",
                        principalColumn: "StatusTypeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TestScripts_Templates_TemplateId",
                        column: x => x.TemplateId,
                        principalTable: "Templates",
                        principalColumn: "TemplateId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ColourSchemes",
                columns: table => new
                {
                    ColourSchemeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Colour = table.Column<string>(type: "nvarchar(7)", maxLength: 7, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    ThemeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ColourSchemes", x => x.ColourSchemeId);
                    table.ForeignKey(
                        name: "FK_ColourSchemes_Themes_ThemeId",
                        column: x => x.ThemeId,
                        principalTable: "Themes",
                        principalColumn: "ThemeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Logos",
                columns: table => new
                {
                    LogoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LogoImage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ThemeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Logos", x => x.LogoId);
                    table.ForeignKey(
                        name: "FK_Logos_Themes_ThemeId",
                        column: x => x.ThemeId,
                        principalTable: "Themes",
                        principalColumn: "ThemeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    CommentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CommentTitle = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CommentLine = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CommentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsModified = table.Column<bool>(type: "bit", nullable: false),
                    DateModified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TestScriptId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserEmail = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.CommentId);
                    table.ForeignKey(
                        name: "FK_Comments_TestScripts_TestScriptId",
                        column: x => x.TestScriptId,
                        principalTable: "TestScripts",
                        principalColumn: "TestScriptId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Defects",
                columns: table => new
                {
                    DefectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DefectDescription = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    DateLogged = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DefectStatusId = table.Column<int>(type: "int", nullable: true),
                    TestScriptId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserEmailAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DefectImage = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Defects", x => x.DefectId);
                    table.ForeignKey(
                        name: "FK_Defects_DefectStatus_DefectStatusId",
                        column: x => x.DefectStatusId,
                        principalTable: "DefectStatus",
                        principalColumn: "DefectStatusId");
                    table.ForeignKey(
                        name: "FK_Defects_TestScripts_TestScriptId",
                        column: x => x.TestScriptId,
                        principalTable: "TestScripts",
                        principalColumn: "TestScriptId");
                });

            migrationBuilder.CreateTable(
                name: "TestScriptAssignments",
                columns: table => new
                {
                    TestScriptId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestScriptAssignments", x => new { x.TestScriptId, x.TeamId, x.UserId });
                    table.ForeignKey(
                        name: "FK_TestScriptAssignments_TeamMembers_TeamId_UserId",
                        columns: x => new { x.TeamId, x.UserId },
                        principalTable: "TeamMembers",
                        principalColumns: new[] { "TeamId", "UserId" });
                    table.ForeignKey(
                        name: "FK_TestScriptAssignments_TestScripts_TestScriptId",
                        column: x => x.TestScriptId,
                        principalTable: "TestScripts",
                        principalColumn: "TestScriptId");
                });

            migrationBuilder.CreateTable(
                name: "TestScriptTags",
                columns: table => new
                {
                    TestScriptId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TagId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestScriptTags", x => new { x.TestScriptId, x.TagId });
                    table.ForeignKey(
                        name: "FK_TestScriptTags_Tags_TagId",
                        column: x => x.TagId,
                        principalTable: "Tags",
                        principalColumn: "TagId");
                    table.ForeignKey(
                        name: "FK_TestScriptTags_TestScripts_TestScriptId",
                        column: x => x.TestScriptId,
                        principalTable: "TestScripts",
                        principalColumn: "TestScriptId");
                });

            migrationBuilder.CreateTable(
                name: "TestSteps",
                columns: table => new
                {
                    TestStepId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TestStepDescription = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    TestStepRole = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    TestStepName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TestData = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    AdditionalInfo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Feedback = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    StepResultId = table.Column<int>(type: "int", nullable: true),
                    TestScriptId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ExpectedOutcome = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestSteps", x => x.TestStepId);
                    table.ForeignKey(
                        name: "FK_TestSteps_StepResults_StepResultId",
                        column: x => x.StepResultId,
                        principalTable: "StepResults",
                        principalColumn: "StepResultId");
                    table.ForeignKey(
                        name: "FK_TestSteps_TestScripts_TestScriptId",
                        column: x => x.TestScriptId,
                        principalTable: "TestScripts",
                        principalColumn: "TestScriptId");
                });

            migrationBuilder.InsertData(
                table: "Action",
                columns: new[] { "ActionId", "ActionName" },
                values: new object[,]
                {
                    { 1, "Create" },
                    { 2, "Update" },
                    { 3, "Delete" }
                });

            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "PermissionId", "PermissionDescription", "PermissionName" },
                values: new object[,]
                {
                    { new Guid("03071ec4-2b96-4032-b654-95062bf23668"), "Enables users to create or modify projects, as well as assign and track project resources. This permission will provide users with more management capabilities.", "canManageProjects" },
                    { new Guid("056af7d9-db22-4cb1-a4de-9dfc929f905f"), "Grants users the ability to create, define or modify roles within the system, This permission will allow users to oversee the addition and management of roles ", "canManageRoles" },
                    { new Guid("0cbd13af-1b5c-404c-828b-510bfb6df98e"), "Grants users the authority to assign, change and remove roles from users. This permission is essential for maintaining role-based-permision access control.", "canManageUserRoles" },
                    { new Guid("25dd9b57-a363-4e10-9f8b-57f6c7263acb"), "Enables users to create, modify and disband teams, as well as assign team members. This permission facilitates the management of team structures.", "canManageTeams" },
                    { new Guid("35bc0f67-948f-47ee-ac1f-16a5d66cfb34"), "Grants users the ability to access and view template information. This permission is will allow users to view or monitor templates without management capabilities.", "canViewTemplates" },
                    { new Guid("35f0935b-357b-42f8-970d-cc8691e6c3de"), "Grants users the ability to access and view detailed role information. This permission is essential for users who need to view or monitor roles without management capabilities.", "canViewRoles" },
                    { new Guid("585ab6a7-f9ea-48b2-80f9-dae55dc26f82"), "Provides users with the ability to create or modify test scripts, including the management capabilities for test steps and related documentation.", "canManageTestScripts" },
                    { new Guid("872eb33b-f2ca-4e97-b1e3-26af66258992"), "Grants users the ability to access and view detailed user information. This permission is essential for users who need to view or monitor user relationships without management capabilities.", "canViewUsers" },
                    { new Guid("9531b3a3-9f00-4e49-a2e8-f2366a3f5382"), "Grants the ability to define, modify and oversee statuses and tags for categorization and progress tracking within the system", "canManageStatusesTags" },
                    { new Guid("98c4cd42-031f-4210-8316-b1eed5e245d7"), "Provides the ability to define and modify permission sets given to roles, ensuring the right levels of access and control. This permission os critical for system security and role management.", "canManagePermissionRoles" },
                    { new Guid("b1d851f1-b097-4d4b-a567-c441e495df2e"), "Grants users the ability to access and view detailed project information. This permission is essential for users who need to view or monitor project relationships without management capabilities.", "canViewProjects" },
                    { new Guid("b23301b3-dc46-4c46-85ab-3682fc95b9fe"), "Provides full, unrestricted access to all system functionalities. Users with this permission will be granted the highest level of access to all resources on the system.", "SystemAdministrator" },
                    { new Guid("c0bb6b29-c46a-47bd-9627-eb17c7c64945"), "Grants users the ability to access and view detailed team information. This permission is essential for users who need to view or monitor team relationships without management capabilities.", "canViewTeams" },
                    { new Guid("ccb44a5d-1167-4ba9-9148-29244da6bee8"), "Grants users the ability to access and view detailed client information. This permission is essential for users who need to view or monitor client relationships without management capabilities.", "canViewClients" },
                    { new Guid("d9314247-33c1-4ddd-849f-ea01275286ad"), "Grants users the ability to create or modify client details, manage associated relationships and oversee client relationships within the system. This permission will provide users with more management capabilities.", "canManageClients" },
                    { new Guid("e2ad3897-a644-4e41-bf95-22fcd17ad951"), "None", "None" },
                    { new Guid("e67c95ce-97a5-4ce7-b0c5-70994bf2aaeb"), "Enables users to create or modify templates, which serve as standardized formats for various possible test cases. This permission provides management capabilities for templates.", "canManageTemplates" },
                    { new Guid("e829b580-2c00-498c-abb0-8efcd2dfce74"), "Provides users with the ability to view, track and oversee the general users on the system. This permission will provide users with user management capabilities.", "canManageUsers" },
                    { new Guid("e9d2b1b2-75ce-4dd7-bb10-a387e6cd1867"), "Grants users the ability to access and view Status & Tag information. This permission is will allow users to view or monitor statuses and tags without management capabilities.", "canViewStatusesTags" }
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "ConcurrencyStamp", "IsDeleted", "Name", "NormalizedName", "RoleDescription" },
                values: new object[,]
                {
                    { new Guid("0c0f1057-a749-44eb-9bd9-c13d27eaf621"), "0c0f1057-a749-44eb-9bd9-c13d27eaf621", false, "Developer", "DEVELOPER", "Access Control configuration for Developers" },
                    { new Guid("22b94730-cc2c-41ac-ab57-6ce3c870a174"), "22b94730-cc2c-41ac-ab57-6ce3c870a174", false, "Tester", "TESTER", "Access Control configuration for Testers" },
                    { new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc"), "4fbc224d-acae-4293-93f4-8b1dcaed67bc", false, "SuperAdmin", "SUPERADMIN", "Access Control configuration for Super Admin" },
                    { new Guid("c6e71fa9-dbbb-46ae-a9be-f95b993497e2"), "c6e71fa9-dbbb-46ae-a9be-f95b993497e2", false, "CoreUser", "COREUSER", "Access Control configuration for Core Users" },
                    { new Guid("e6631a13-ce21-4b2c-ab8e-3dd6f0103987"), "e6631a13-ce21-4b2c-ab8e-3dd6f0103987", false, "Auditor", "AUDITOR", "Access Control configuration for System Auditors" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "IsDeleted", "IsNewPassword", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "RegStatusId", "RegistrationCode", "RegistrationDate", "ResetCode", "ResetCodeExpiration", "SecurityStamp", "TwoFactorEnabled", "UserContactNumber", "UserEmailAddress", "UserFirstName", "UserIDNumber", "UserName", "UserSurname" },
                values: new object[,]
                {
                    { new Guid("2e363eee-3e03-4182-9242-24422a56a478"), 0, "5d2f32aa-b8aa-44f8-b605-d71e8d73d1b7", "u21486507@tuks.co.za", false, false, false, false, null, "U21486507@TUKS.CO.ZA", "KAMOGELOMALATSI551", "AQAAAAIAAYagAAAAEDdev1uQ2/1JlWjgkB0+MP7P8bSoD2xC7Rrb+X1Qbp4oxB05//on5piytRxCmIN39A==", null, false, 4, "LLR45", new DateTime(2025, 1, 25, 12, 53, 23, 661, DateTimeKind.Local).AddTicks(7999), null, null, "0e45af7e-9977-41f6-9206-59f72da9102f", false, "0622383477", "u21486507@tuks.co.za", "Kamogelo", "0205086094083", "KamogeloMalatsi551", "Malatsi" },
                    { new Guid("383b0a0b-7e55-47a0-8c5c-ac1d5b290026"), 0, "27117262-ed7a-44e6-bc77-2992a02ac003", "u21438383@tuks.co.za", false, false, false, false, null, "U21438383@TUKS.CO.ZA", "NOSIPHOZWANE992", "AQAAAAIAAYagAAAAEF0GgChZDj0pBCUIBptfdWNc+NkPeO07WTnOp8/S0ZaGctTcAlgVz8djFhUMHdRykw==", null, false, 4, "NZ020", new DateTime(2025, 1, 25, 12, 53, 23, 809, DateTimeKind.Local).AddTicks(7326), null, null, "3c3dbb20-88c0-4865-a157-0e2cabe0d7b7", false, "0614078955", "u21438383@tuks.co.za", "Nosipho", "0205086094083", "NosiphoZwane992", "Zwane" },
                    { new Guid("7ef11ac8-94fb-4bdf-a817-2d141e767a1e"), 0, "66d2c895-5c65-43d8-95e5-3a8124ae21a6", "u21429032@tuks.co.za", false, false, false, false, null, "U21429032@TUKS.CO.ZA", "ISMAILCARIM012", "AQAAAAIAAYagAAAAEAokpZBsIfyWu/AkCEUGdHr0S0ro0vY/jVHabenuI6fRNtN6hwzU1C160sbOwnR8FA==", null, false, 4, "3GH51", new DateTime(2025, 1, 25, 12, 53, 23, 739, DateTimeKind.Local).AddTicks(3893), null, null, "7cc73f00-e251-4805-b7f3-422ee03a1d9e", false, "0729790966", "u21429032@tuks.co.za", "Ismail", "0205086094083", "IsmailCarim012", "Carim" },
                    { new Guid("8f9a44e9-066d-4301-84ac-eb11d2b578d0"), 0, "0924880a-3d61-4462-899d-0edce6efc9a6", "super@tst.com", false, false, false, false, null, "SUPER@TST.COM", "SUPERADMIN500", "AQAAAAIAAYagAAAAEHcX/Ig6QVWGH2bjwPti7RjGtzltJl+tm5OwTZAjCzSfZvMhxqvR7ePvXM736oOzvA==", null, false, 4, "SARTX", new DateTime(2025, 1, 25, 12, 53, 23, 510, DateTimeKind.Local).AddTicks(2387), null, null, "5e50c31f-6984-48cc-a942-d251dcf6dcaa", false, "0124567899", "super@tst.com", "Carlton", "0205086094083", "SuperAdmin500", "Banks" },
                    { new Guid("ccd0b41c-ec58-47ce-9d34-72cf573c5fe6"), 0, "91113f11-0fa8-49bf-b25b-723771631f1f", "u21555070@tuks.co.za", false, false, false, false, null, "U21555070@TUKS.CO.ZA", "LERATOFANI355", "AQAAAAIAAYagAAAAEDQ0ph67n2L6rcJ/DFmUOZQKjHRGazEPOSz2sIcUhfJ608sbdyBssucX35AQe/YK3A==", null, false, 4, "LF402", new DateTime(2025, 1, 25, 12, 53, 23, 879, DateTimeKind.Local).AddTicks(4340), null, null, "8c85d29e-2023-4901-8833-95dea60ce970", false, "0633621013", "u21555070@tuks.co.za", "Lerato", "0205086094083", "LeratoFani355", "Fani" },
                    { new Guid("f52582eb-2328-49d2-a338-6a1c1939f86e"), 0, "04b65960-b1a3-46be-8271-17501169e4be", "u21496529@tuks.co.za", false, false, false, false, null, "U21496529@TUKS.CO.ZA", "TUMELOMOGANO105", "AQAAAAIAAYagAAAAEDXZgLRxycgraNZRrccnw1KuOT0ERDxQoIRekJwhl41wOvypchYFcnMZhcUyFZGyHQ==", null, false, 4, "10050", new DateTime(2025, 1, 25, 12, 53, 23, 581, DateTimeKind.Local).AddTicks(5678), null, null, "84b09b11-f4e3-4a6e-9eca-b12eff69075d", false, "0124567899", "u21496529@tuks.co.za", "Tumelo", "0205086094083", "TumeloMogano105", "Mogano" }
                });

            migrationBuilder.InsertData(
                table: "RolePermissions",
                columns: new[] { "PermissionId", "RoleId" },
                values: new object[,]
                {
                    { new Guid("03071ec4-2b96-4032-b654-95062bf23668"), new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc") },
                    { new Guid("056af7d9-db22-4cb1-a4de-9dfc929f905f"), new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc") },
                    { new Guid("0cbd13af-1b5c-404c-828b-510bfb6df98e"), new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc") },
                    { new Guid("25dd9b57-a363-4e10-9f8b-57f6c7263acb"), new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc") },
                    { new Guid("35bc0f67-948f-47ee-ac1f-16a5d66cfb34"), new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc") },
                    { new Guid("35f0935b-357b-42f8-970d-cc8691e6c3de"), new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc") },
                    { new Guid("585ab6a7-f9ea-48b2-80f9-dae55dc26f82"), new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc") },
                    { new Guid("872eb33b-f2ca-4e97-b1e3-26af66258992"), new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc") },
                    { new Guid("9531b3a3-9f00-4e49-a2e8-f2366a3f5382"), new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc") },
                    { new Guid("98c4cd42-031f-4210-8316-b1eed5e245d7"), new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc") },
                    { new Guid("b1d851f1-b097-4d4b-a567-c441e495df2e"), new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc") },
                    { new Guid("b23301b3-dc46-4c46-85ab-3682fc95b9fe"), new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc") },
                    { new Guid("c0bb6b29-c46a-47bd-9627-eb17c7c64945"), new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc") },
                    { new Guid("ccb44a5d-1167-4ba9-9148-29244da6bee8"), new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc") },
                    { new Guid("d9314247-33c1-4ddd-849f-ea01275286ad"), new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc") },
                    { new Guid("e67c95ce-97a5-4ce7-b0c5-70994bf2aaeb"), new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc") },
                    { new Guid("e829b580-2c00-498c-abb0-8efcd2dfce74"), new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc") },
                    { new Guid("e9d2b1b2-75ce-4dd7-bb10-a387e6cd1867"), new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc") }
                });

            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { new Guid("c6e71fa9-dbbb-46ae-a9be-f95b993497e2"), new Guid("2e363eee-3e03-4182-9242-24422a56a478") },
                    { new Guid("c6e71fa9-dbbb-46ae-a9be-f95b993497e2"), new Guid("383b0a0b-7e55-47a0-8c5c-ac1d5b290026") },
                    { new Guid("c6e71fa9-dbbb-46ae-a9be-f95b993497e2"), new Guid("7ef11ac8-94fb-4bdf-a817-2d141e767a1e") },
                    { new Guid("0c0f1057-a749-44eb-9bd9-c13d27eaf621"), new Guid("8f9a44e9-066d-4301-84ac-eb11d2b578d0") },
                    { new Guid("22b94730-cc2c-41ac-ab57-6ce3c870a174"), new Guid("8f9a44e9-066d-4301-84ac-eb11d2b578d0") },
                    { new Guid("4fbc224d-acae-4293-93f4-8b1dcaed67bc"), new Guid("8f9a44e9-066d-4301-84ac-eb11d2b578d0") },
                    { new Guid("c6e71fa9-dbbb-46ae-a9be-f95b993497e2"), new Guid("ccd0b41c-ec58-47ce-9d34-72cf573c5fe6") },
                    { new Guid("c6e71fa9-dbbb-46ae-a9be-f95b993497e2"), new Guid("f52582eb-2328-49d2-a338-6a1c1939f86e") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLog_ActionId",
                table: "AuditLog",
                column: "ActionId");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLog_UserId",
                table: "AuditLog",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Cities_RegionId",
                table: "Cities",
                column: "RegionId");

            migrationBuilder.CreateIndex(
                name: "IX_ClientRepresentatives_ClientId",
                table: "ClientRepresentatives",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_ClientRepresentatives_UserId",
                table: "ClientRepresentatives",
                column: "UserId",
                unique: true,
                filter: "[UserId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Clients_CityId",
                table: "Clients",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_ColourSchemes_ThemeId",
                table: "ColourSchemes",
                column: "ThemeId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_TestScriptId",
                table: "Comments",
                column: "TestScriptId");

            migrationBuilder.CreateIndex(
                name: "IX_Defects_DefectStatusId",
                table: "Defects",
                column: "DefectStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Defects_TestScriptId",
                table: "Defects",
                column: "TestScriptId");

            migrationBuilder.CreateIndex(
                name: "IX_DownloadReportHistory_UserId",
                table: "DownloadReportHistory",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_EventParticipants_ScheduleEventId",
                table: "EventParticipants",
                column: "ScheduleEventId");

            migrationBuilder.CreateIndex(
                name: "IX_EventParticipants_UserId",
                table: "EventParticipants",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Logos_ThemeId",
                table: "Logos",
                column: "ThemeId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_Id",
                table: "Notifications",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_NotificationTypeId",
                table: "Notifications",
                column: "NotificationTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_ProjectId",
                table: "Notifications",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ClientId",
                table: "Projects",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_PhaseId",
                table: "Projects",
                column: "PhaseId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_TeamId",
                table: "Projects",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Regions_CountryId",
                table: "Regions",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_RoleClaims_RoleId",
                table: "RoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_PermissionId",
                table: "RolePermissions",
                column: "PermissionId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "Roles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleEvents_UserId",
                table: "ScheduleEvents",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Statuses_ProjectId",
                table: "Statuses",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Statuses_StatusTypeId",
                table: "Statuses",
                column: "StatusTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Tags_TagTypeId",
                table: "Tags",
                column: "TagTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMembers_UserId",
                table: "TeamMembers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Templates_TempStatusId",
                table: "Templates",
                column: "TempStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_TemplateTestSteps_TemplateId",
                table: "TemplateTestSteps",
                column: "TemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_TestScriptAssignments_TeamId_UserId",
                table: "TestScriptAssignments",
                columns: new[] { "TeamId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_TestScripts_ProjectId",
                table: "TestScripts",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_TestScripts_StatusTypeId",
                table: "TestScripts",
                column: "StatusTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_TestScripts_TemplateId",
                table: "TestScripts",
                column: "TemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_TestScriptTags_TagId",
                table: "TestScriptTags",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_TestSteps_StepResultId",
                table: "TestSteps",
                column: "StepResultId");

            migrationBuilder.CreateIndex(
                name: "IX_TestSteps_TestScriptId",
                table: "TestSteps",
                column: "TestScriptId");

            migrationBuilder.CreateIndex(
                name: "IX_Themes_ClientId",
                table: "Themes",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Themes_FontId",
                table: "Themes",
                column: "FontId");

            migrationBuilder.CreateIndex(
                name: "IX_UserClaims_UserId",
                table: "UserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLogins_UserId",
                table: "UserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "Users",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "IX_Users_RegStatusId",
                table: "Users",
                column: "RegStatusId");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "Users",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLog");

            migrationBuilder.DropTable(
                name: "ClientRepresentatives");

            migrationBuilder.DropTable(
                name: "ColourSchemes");

            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "Defects");

            migrationBuilder.DropTable(
                name: "DownloadReportHistory");

            migrationBuilder.DropTable(
                name: "EventParticipants");

            migrationBuilder.DropTable(
                name: "Help");

            migrationBuilder.DropTable(
                name: "HelpPage");

            migrationBuilder.DropTable(
                name: "Logos");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "RoleClaims");

            migrationBuilder.DropTable(
                name: "RolePermissions");

            migrationBuilder.DropTable(
                name: "Statuses");

            migrationBuilder.DropTable(
                name: "TemplateTestSteps");

            migrationBuilder.DropTable(
                name: "TestScriptAssignments");

            migrationBuilder.DropTable(
                name: "TestScriptTags");

            migrationBuilder.DropTable(
                name: "TestSteps");

            migrationBuilder.DropTable(
                name: "UserClaims");

            migrationBuilder.DropTable(
                name: "UserLogins");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "UserTokens");

            migrationBuilder.DropTable(
                name: "Action");

            migrationBuilder.DropTable(
                name: "DefectStatus");

            migrationBuilder.DropTable(
                name: "ScheduleEvents");

            migrationBuilder.DropTable(
                name: "Themes");

            migrationBuilder.DropTable(
                name: "NotificationTypes");

            migrationBuilder.DropTable(
                name: "Permissions");

            migrationBuilder.DropTable(
                name: "TeamMembers");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropTable(
                name: "StepResults");

            migrationBuilder.DropTable(
                name: "TestScripts");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Fonts");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "TagTypes");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "StatusTypes");

            migrationBuilder.DropTable(
                name: "Templates");

            migrationBuilder.DropTable(
                name: "RegistrationStatus");

            migrationBuilder.DropTable(
                name: "Clients");

            migrationBuilder.DropTable(
                name: "Phases");

            migrationBuilder.DropTable(
                name: "Teams");

            migrationBuilder.DropTable(
                name: "TemplateStatus");

            migrationBuilder.DropTable(
                name: "Cities");

            migrationBuilder.DropTable(
                name: "Regions");

            migrationBuilder.DropTable(
                name: "Countries");
        }
    }
}
