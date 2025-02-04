import { defineStore } from "pinia";

export const useUI = defineStore("ui-store", () => {
    const updateCount = ref(0);

    const update = () => {
        updateCount.value = updateCount.value + 1;
    }

    return {
        updateCount,
        update,
    };
});