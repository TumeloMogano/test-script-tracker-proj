export enum Permissions {
    None = 0,
    canViewClients = 1,
    canViewProjects = 2,
    canViewRoles = 4,
    canViewUsers = 8,
    canViewTeams = 16,
    canViewTemplates = 32,
    canViewStatusesTags = 64,
    canManageClients = 128,
    canManageProjects = 256,
    canManageRoles = 512,
    canManageUsers = 1024,
    canManageTeams = 2048,
    canManageStatusesTags = 4096,
    canManageTestScripts = 8192,
    canManageTemplates = 16384,
    canManageUserRoles = 32768,
    canManagePermissionRoles = 65536,
    SystemAdministrator = ~None
}

