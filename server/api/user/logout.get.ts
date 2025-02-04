import { AUTH_COOKIE } from "@/constants";
import { createAdminClient } from "@/lib/appwrite";

export default defineEventHandler(async (event) => {
    try {
        deleteCookie(event, AUTH_COOKIE);

        const { account } = await createAdminClient();
        await account.deleteSession('current');
        await account.deleteSession("appwrite-session");

        return { success: true };

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "Failed to sign out user"
        })
    }
}); 