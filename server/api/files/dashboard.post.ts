import { createSessionClient } from "@/lib/appwrite";
import { Query, Models } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
const { DATABASE_ID, FILES_COLLECTION, USERS_COLLECTION_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const { types, searchText, sort, limit } = await readBody(event);

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

        const queries = createQueries(currentUser, types || [], searchText || "", sort || "$createdAt-desc", limit);

        const files = await databases.listDocuments(
            DATABASE_ID,
            FILES_COLLECTION,
            queries,
        );

        return parseStringify(files);

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "Failed to get files"
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

