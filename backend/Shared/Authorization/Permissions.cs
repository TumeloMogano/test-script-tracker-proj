namespace TestScriptTracker.Shared.Authorization
{
    [Flags]
    public enum Permissions : Int64
    {
        None = 0L,
        canViewClients = 1L,
        canViewProjects = 2L,
        canViewRoles = 4L,
        canViewUsers = 8L,
        canViewTeams = 16L,
        canViewTemplates = 32L,
        canViewStatusesTags = 64L,
        canManageClients = 128L,
        canManageProjects = 256L,
        canManageRoles = 512L,
        canManageUsers = 1024L,
        canManageTeams = 2048L,
        canManageStatusesTags = 4096L,
        canManageTestScripts = 8192L,
        canManageTemplates = 16384L,
        canManageUserRoles = 32768L,
        canManagePermissionRoles = 65536L,
        SystemAdministrator = ~None
    }
}
