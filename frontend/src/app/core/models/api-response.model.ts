export interface ApiError {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
    details?: string[];
}

export interface ApiResponse<T> {
    data?: T;
    error?: ApiError;
}
