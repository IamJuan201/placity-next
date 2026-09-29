import type { User } from "./user";

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface ChangePassword {
    currentPassword: string;
    newPassword: string;
}
