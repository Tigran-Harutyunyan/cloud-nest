import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { getFileType, parseStringify } from "@/lib/utils";
const { DATABASE_ID, BUCKET, FILES_COLLECTION, APPWRITE_ENDPOINT, PROJECT_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const formData = await readFormData(event);
    const file = formData.get('file');
    const ownerId = formData.get('ownerId');
    const accountId = formData.get('accountId');

    if (!file) {
        return createError({
            statusCode: 500,
            statusMessage: 'File is missing'
        })
    }

    if (!ownerId) {
        return createError({
            statusCode: 500,
            statusMessage: 'Owner id is missing'
        })
    }

    if (!accountId) {
        return createError({
            statusCode: 500,
            statusMessage: 'Account id id is missing'
        })
    }

    try {

        const { databases, storage } = await createAdminClient();
        const inputFile = InputFile.fromBuffer(file, file?.name);

        const bucketFile = await storage.createFile(
            BUCKET,
            ID.unique(),
            inputFile,
        );

        const fileDocument = {
            type: getFileType(bucketFile.name).type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(bucketFile.name).extension,
            size: bucketFile.sizeOriginal,
            owner: ownerId,
            accountId,
            users: [],
            bucketFileId: bucketFile.$id,
        };

        const newFile = await databases
            .createDocument(
                DATABASE_ID,
                FILES_COLLECTION,
                ID.unique(),
                fileDocument,
            )
            .catch(async (error: unknown) => {
                console.log('error', error)
                await storage.deleteFile(BUCKET, bucketFile.$id);
                return createError({
                    statusCode: 500,
                    statusMessage: error instanceof Error ? error.message : "Failed to create file document"
                })
            });

        return parseStringify(newFile);

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "Failed to upload file"
        })
    }
});

export const constructFileUrl = (bucketFileId: string) => {
    return `${APPWRITE_ENDPOINT}/storage/buckets/${BUCKET}/files/${bucketFileId}/view?project=${PROJECT_ID}`;
};