export interface UserDto {
    id: number;
    email: string;
    isEmailVerified: boolean;
    token: string;
    userType: string;
    status: string;
}

export interface SystemLogDto {
    id: number;
    userName: string;
    ipAddress: string;
    dateTime: string;
    log: string;
}

export interface PageResponse<T> {
    content: T[];
    pageable: any;
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}
