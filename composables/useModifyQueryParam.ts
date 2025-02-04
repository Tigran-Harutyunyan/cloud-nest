import { useRouter, useRoute } from 'vue-router';

export function useModifyQueryParam() {
    const route = useRoute();

    const getModifiedQueryParam = (path: string, key: string, value: string) => {
        const newQuery = { ...route.query, [key]: value };
        return { path: `/${path}`, query: newQuery };
    };

    return { getModifiedQueryParam };
}
