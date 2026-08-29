export interface UserDto {
    id: number;
    email: string;
    isEmailVerified: boolean;
    token: string;
    userType: string;
    status: string;
}
