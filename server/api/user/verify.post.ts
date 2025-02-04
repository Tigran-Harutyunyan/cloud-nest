import { createAdminClient } from "@/lib/appwrite";
import { AUTH_COOKIE } from "@/constants";

export default defineEventHandler(async (event) => {
    const { accountId, password } = await readBody(event);

    if (!accountId) {
        return createError({
            statusCode: 500,
            statusMessage: 'AccountId is missing'
        })
    }

    if (!password) {
        return createError({
            statusCode: 500,
            statusMessage: 'Password is missing'
        })
    }

    try {
        const { account } = await createAdminClient();

        const session = await account.createSession(
            accountId,
            password,
        );

        setCookie(event, AUTH_COOKIE, session.secret, {
            path: "/",
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30,
        })

        return { success: true };

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "Failed to verify OTP"
        })
    }
}); 