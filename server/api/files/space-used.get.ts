import { createSessionClient } from "@/lib/appwrite";
import { Query, Models } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
const { DATABASE_ID, FILES_COLLECTION, USERS_COLLECTION_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {

    try {
        const { databases, account } = await createSessionClient(event);

        const result = await account.get();

        const response = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.equal("accountId", result.$id)],
        );

        if (response.total <= 0) {
            return createError({
                statusCode: 500,
                statusMessage: "User not found"
            })
        }

        const currentUser = response.documents[0];

        const files = await databases.listDocuments(
            DATABASE_ID,
            FILES_COLLECTION,
            [Query.equal("owner", [currentUser.$id])],
        );

        const totalSpace = {
            image: { size: 0, latestDate: "" },
            document: { size: 0, latestDate: "" },
            video: { size: 0, latestDate: "" },
            audio: { size: 0, latestDate: "" },
            other: { size: 0, latestDate: "" },
            used: 0,
            all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
        };

        files.documents.forEach((file) => {
            const fileType = file.type as FileType;
            totalSpace[fileType].size += file.size;
            totalSpace.used += file.size;

            if (
                !totalSpace[fileType].latestDate ||
                new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
            ) {
                totalSpace[fileType].latestDate = file.$updatedAt;
            }
        });

        return parseStringify(totalSpace);

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "Failed to get filesError calculating total space used"
        })
    }
});

const createQueries = (
    currentUser: Models.Document,
    types: string[],
    searchText: string,
    sort: string,
    limit?: number,
) => {
    const queries = [
        Query.or([
            Query.equal("owner", [currentUser.$id]),
            Query.contains("users", [currentUser.email]),
        ]),
    ];

    if (types.length > 0) queries.push(Query.equal("type", types));
    if (searchText) queries.push(Query.contains("name", searchText));
    if (limit) queries.push(Query.limit(limit));

    if (sort) {
        const [sortBy, orderBy] = sort.split("-");

        queries.push(
            orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy),
        );
    }

    return queries;
};