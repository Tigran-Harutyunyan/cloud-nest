import { createAdminClient } from "@/lib/appwrite";
import { Query, ID } from "node-appwrite";
import { avatarPlaceholderUrl } from "@/constants";
import { parseStringify } from "@/lib/utils";

const { DATABASE_ID, USERS_COLLECTION_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    try {
        const { fullName, email } = await readBody<{ fullName: string; email: string }>(event);

        if (!email) {
            throw createError({ statusCode: 400, statusMessage: "Email is required" });
        }

        if (!fullName) {
            throw createError({ statusCode: 400, statusMessage: "Full name is required" });
        }

        const { databases, account } = await createAdminClient();

        // Check if user already exists
        const result = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
            Query.equal("email", email),
        ]);

        const existingUser = result.documents[0] ?? null;

        // Create an OTP session
        const session = await account.createEmailToken(ID.unique(), email);
        if (!session?.userId) {
            throw createError({ statusCode: 500, statusMessage: "Failed to send OTP" });
        }

        const accountId = session.userId;

        // Create user record if it doesn't exist
        if (!existingUser) {
            await databases.createDocument(DATABASE_ID, USERS_COLLECTION_ID, ID.unique(), {
                fullName,
                email,
                avatar: avatarPlaceholderUrl,
                accountId,
            });
        }

        return parseStringify({ accountId });
    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "Create account error",
        });
    }
});
