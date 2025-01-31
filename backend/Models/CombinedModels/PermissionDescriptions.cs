using TestScriptTracker.Shared.Authorization;

namespace TestScriptTracker.Models.CombinedModels
{
    public class PermissionDescriptions
    {
        public static readonly Dictionary<Permissions, string> Descriptions = new Dictionary<Permissions, string>
        {
            { Permissions.None, "None" },
            { Permissions.canViewClients, "Grants users the ability to access and view detailed client information. This permission is essential for users who need to view or monitor client relationships without management capabilities." },
            { Permissions.canViewProjects, "Grants users the ability to access and view detailed project information. This permission is essential for users who need to view or monitor project relationships without management capabilities." },
            { Permissions.canViewRoles, "Grants users the ability to access and view detailed role information. This permission is essential for users who need to view or monitor roles without management capabilities." },
            { Permissions.canViewUsers, "Grants users the ability to access and view detailed user information. This permission is essential for users who need to view or monitor user relationships without management capabilities." },
            { Permissions.canViewTeams, "Grants users the ability to access and view detailed team information. This permission is essential for users who need to view or monitor team relationships without management capabilities." },
            { Permissions.canViewTemplates, "Grants users the ability to access and view template information. This permission is will allow users to view or monitor templates without management capabilities." },
            { Permissions.canViewStatusesTags, "Grants users the ability to access and view Status & Tag information. This permission is will allow users to view or monitor statuses and tags without management capabilities." },
            { Permissions.canManageClients, "Grants users the ability to create or modify client details, manage associated relationships and oversee client relationships within the system. This permission will provide users with more management capabilities." },
            { Permissions.canManageProjects, "Enables users to create or modify projects, as well as assign and track project resources. This permission will provide users with more management capabilities." },
            { Permissions.canManageRoles, "Grants users the ability to create, define or modify roles within the system, This permission will allow users to oversee the addition and management of roles " },
            { Permissions.canManageUsers, "Provides users with the ability to view, track and oversee the general users on the system. This permission will provide users with user management capabilities." },
            { Permissions.canManageTeams, "Enables users to create, modify and disband teams, as well as assign team members. This permission facilitates the management of team structures." },
            { Permissions.canManageStatusesTags, "Grants the ability to define, modify and oversee statuses and tags for categorization and progress tracking within the system" },
            { Permissions.canManageTestScripts, "Provides users with the ability to create or modify test scripts, including the management capabilities for test steps and related documentation." },
            { Permissions.canManageTemplates, "Enables users to create or modify templates, which serve as standardized formats for various possible test cases. This permission provides management capabilities for templates." },
            { Permissions.canManageUserRoles, "Grants users the authority to assign, change and remove roles from users. This permission is essential for maintaining role-based-permision access control." },
            { Permissions.canManagePermissionRoles, "Provides the ability to define and modify permission sets given to roles, ensuring the right levels of access and control. This permission os critical for system security and role management." },
            { Permissions.SystemAdministrator, "Provides full, unrestricted access to all system functionalities. Users with this permission will be granted the highest level of access to all resources on the system." }
        };
    }
}
