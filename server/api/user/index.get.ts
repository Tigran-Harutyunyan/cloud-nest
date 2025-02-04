import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
const { DATABASE_ID, USERS_COLLECTION_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    try {

        const { databases, account } = await createSessionClient(event);
        const result = await account.get();

        const user = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.equal("accountId", result.$id)],
        );

        if (user.total <= 0) return null;

        return parseStringify(user.documents[0]);

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "Get user error"
        })
    }
}); 