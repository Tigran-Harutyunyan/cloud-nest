import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";

export default defineEventHandler(async (event) => {
    try {
        const { email } = await readBody<{ email: string }>(event);

        if (!email) {
            throw createError({ statusCode: 400, statusMessage: "Email is required" });
        }

        const { account } = await createAdminClient();
        const session = await account.createEmailToken(ID.unique(), email);

        return { accountId: session.userId };
    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "Failed to send email",
        });
    }
});
