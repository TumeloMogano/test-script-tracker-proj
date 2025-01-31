export interface Team {
    teamId: string;
    teamName: string;
    teamDescription: string;
    creationDate?: Date | null;
}

export interface TeamMember {
    teamId: string;
    userId: string;
    userFirstName: string;
    userSurname: string;
    userContactNumber: string;
    userEmailAddress: string;
    isTeamLead: boolean;
}

export interface TeamUser {
    userId: string;
    userFirstName: string;
    userSurname: string;
    userContactNumber: string;
    userEmailAddress: string;
}

export interface AddTeamMember {
    teamId: string;
    userId: string;
    isTeamLead: boolean;
}