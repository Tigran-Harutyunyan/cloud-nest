import { useRouter, useRoute } from 'vue-router';

export function useModifyQueryParam() {
    const router = useRouter();
    const route = useRoute();

    const modifyQueryParam = (path: string, key: string, value: string) => {
        const newQuery = { ...route.query, [key]: value };
        router.push({ path: `/${path}`, query: newQuery });
    };

    return { modifyQueryParam };
}
