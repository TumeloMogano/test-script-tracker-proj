﻿using Microsoft.AspNetCore.Authorization;

namespace TestScriptTracker.Shared.Authorization
{
    public class PermissionAuthorizationRequirement : IAuthorizationRequirement
    {
        public PermissionAuthorizationRequirement(Permissions permission)
        {
            Permissions = permission;
        }

        public Permissions Permissions { get; }
    }
}
