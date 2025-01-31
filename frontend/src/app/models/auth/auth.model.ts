export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    surname: string;
    idNumber: string;
    contactNumber: string;
}