import axios from "axios"
import type { ApiErrorResponse } from "../types/api"

export function getErrorMessage(error: unknown, defaultMessage: string): string {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const message = error.response?.data?.message

        if (Array.isArray(message)) {
            return message.join(', ')
        }

        if (message) {
            return message
        }
    }

    return defaultMessage
}