declare module 'http-errors' {
    interface HttpError extends Error {
        status?: number;
        statusCode?: number;
        expose?: boolean;
        headers?: {
            [key: string]: string;
        };
    }

    interface CreateHttpError {
        (status: number, message?: string, properties?: Record<string, any>): HttpError;
        (message?: string, properties?: Record<string, any>): HttpError;
    }

    const createError: CreateHttpError;
    export default createError;
}
