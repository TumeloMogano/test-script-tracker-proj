export interface Role {
    roleId: string;
    name: string;
    roleDescription: string;
}

export interface RoleWithChecked extends Role {
    checked: boolean;
}
