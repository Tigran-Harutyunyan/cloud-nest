<script setup>
import { Loader } from "lucide-vue-next";
import { getFileTypesParams } from "@/lib/utils";
import { useUI } from "@/store/useUI";

const route = useRoute();
if (!["images", "documents", "media", "others"].includes(route.params.type)) {
  navigateTo("/");
}

const queryClient = useQueryClient();

const type = route.params.type || "";
const { updateCount } = storeToRefs(useUI());

const { data: files, isPending } = useQuery({
  queryKey: [type],
  queryFn: () =>
    $fetch("/api/files", {
      method: "POST",
      body: {
        types: getFileTypesParams(type),
        searchText: route.query?.search || "",
        sort: route.query?.sort || "",
      },
      server: false,
    }),
});

watch(
  () => [updateCount.value, route.fullPath],
  () => {
    queryClient.invalidateQueries({ queryKey: [type] });
  }
);
</script>

<template>
  <NuxtLayout name="default">
    <div class="mx-auto flex w-full max-w-7xl flex-col items-center gap-8">
      <section class="w-full">
        <h1 class="h1 capitalize">{{ type }}</h1>

        <div class="flex mt-2 flex-col justify-end sm:flex-row sm:items-center">
          <div class="mt-5 flex items-center sm:mt-0 sm:gap-3">
            <p class="body-1 hidden text-light-200 sm:block">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>

      <Loader
        v-if="isPending"
        class="size-5 animate-spin text-muted-foreground"
      />

      <template v-else>
        <section
          v-if="files?.total > 0"
          class="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <Card v-for="file in files.documents" :key="file.$id" :file="file" />
        </section>

        <p v-else class="body-1 mt-10 text-center text-light-200">
          No files uploaded
        </p>
      </template>
    </div>
  </NuxtLayout>
</template>
