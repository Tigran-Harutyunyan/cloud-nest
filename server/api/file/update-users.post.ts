import { createAdminClient } from "@/lib/appwrite";
import { parseStringify } from "@/lib/utils";
const { DATABASE_ID, FILES_COLLECTION } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const { emails, fileId } = await readBody(event);

    try {

        const { databases } = await createAdminClient();

        const updatedFile = await databases.updateDocument(
            DATABASE_ID,
            FILES_COLLECTION,
            fileId,
            {
                users: emails,
            },
        );

        return parseStringify(updatedFile);

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "Failed to share file"
        })
    }
});