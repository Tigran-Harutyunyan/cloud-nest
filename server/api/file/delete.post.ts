import { createAdminClient } from "@/lib/appwrite";
import { parseStringify } from "@/lib/utils";
const { DATABASE_ID, BUCKET, FILES_COLLECTION, APPWRITE_ENDPOINT, PROJECT_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const { fileId, bucketFileId } = await readBody(event);

    try {

        const { storage, databases } = await createAdminClient();

        const deletedFile = await databases.deleteDocument(
            DATABASE_ID,
            FILES_COLLECTION,
            fileId,
        );

        if (deletedFile) {
            await storage.deleteFile(BUCKET, bucketFileId);
        }

        return parseStringify({ status: "success" });

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "Failed to delete file"
        })
    }
});