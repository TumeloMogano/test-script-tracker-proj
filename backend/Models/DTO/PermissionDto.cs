namespace TestScriptTracker.Models.DTO
{
    public class PermissionDto
    {
        public string PermissionName { get; set; } = string.Empty;
        public string PermissionDescription { get; set; } = string.Empty;

        public PermissionDto(string permissionName, string permissionDescription)
        {
            PermissionName = permissionName;
            PermissionDescription = permissionDescription;
        }
    }
}
