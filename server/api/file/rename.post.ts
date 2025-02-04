import { createAdminClient } from "@/lib/appwrite";
import { parseStringify } from "@/lib/utils";
const { DATABASE_ID, BUCKET, FILES_COLLECTION, APPWRITE_ENDPOINT, PROJECT_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const { name, extension, fileId } = await readBody(event);

    try {

        const { databases } = await createAdminClient();
        const newName = `${name}.${extension}`;
        const updatedFile = await databases.updateDocument(
            DATABASE_ID,
            FILES_COLLECTION,
            fileId,
            {
                name: newName,
            },
        );

        return parseStringify(updatedFile);

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "Failed to rename file"
        })
    }
});