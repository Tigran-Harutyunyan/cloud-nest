import { AUTH_COOKIE } from "@/constants";

export default defineEventHandler(async (event) => {
    try {
        deleteCookie(event, AUTH_COOKIE);

        return { success: true };

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "Failed to sign out user"
        })
    }
}); 