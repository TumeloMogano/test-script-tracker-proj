export interface AspUsers {
    id?: string,
    userFirstName?:string;
    userSurname?:string;
    userIDNumber?:string;
    userContactNumber?:string;
    userEmailAddress?:string;
    registrationDate? :Date;
    registrationCode?:string;
    templateCreation?:string;
    email?: string;
    normalizedEmail?: string;
    passwordHash?:string;
    regStatusId?: number;
    registrationStatusName?:string;
}