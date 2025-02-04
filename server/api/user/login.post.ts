import { createAdminClient } from "@/lib/appwrite";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";

const { DATABASE_ID, USERS_COLLECTION_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const { email } = await readBody(event);

    if (!email) {
        return createError({
            statusCode: 500,
            statusMessage: 'Email is missing'
        })
    }

    try {

        const { databases, account } = await createAdminClient();

        const result = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.equal("email", [email as string])],
        );

        const existingUser = result.total > 0 ? result.documents[0] : null;

        // User exists, send OTP
        if (existingUser) {
            await account.createEmailToken(ID.unique(), email as string);
            return parseStringify({ accountId: existingUser.accountId });
        }

        return parseStringify({ accountId: null, error: "User not found" });

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "Failed to sign in user"
        })
    }
}); 