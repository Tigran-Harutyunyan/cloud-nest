<script setup lang="ts">
import { Loader } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import Thumbnail from "@/components/Thumbnail.vue";
import FormattedDateTime from "@/components/FormattedDateTime.vue";
import { type Models } from "node-appwrite";
import { useDebounceFn, onClickOutside } from "@vueuse/core";

const target = ref(null);
const route = useRoute();
const queryClient = useQueryClient();

const search = ref((route.query.search as string) || "");
const results = ref<Models.Document[]>([]);
const showResults = ref(false);
const isLoading = ref(false);

const DEBOUNCE_TIMEOUT = 500;

onClickOutside(target, () => {
  showResults.value = false;
});

const debouncedFn = useDebounceFn(async () => {
  if (!search.value) {
    results.value = [];
    showResults.value = false;
    return;
  }

  isLoading.value = true;

  try {
    const data = await $fetch<GetFilesResponseType>("/api/files", {
      method: "POST",
      body: { types: [], searchText: search.value, limit: 30 },
    });

    if (data?.documents) {
      results.value = data?.documents;
      showResults.value = true;
    }
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
}, DEBOUNCE_TIMEOUT);

const handleClick = (file: Models.Document) => {
  results.value = [];
  showResults.value = false;
  const pluralType = file.type + "s";
  search.value = file.name.replace(`.${file.extension}`, "");

  queryClient.invalidateQueries({ queryKey: [file.extension + "s"] });

  navigateTo(
    `/${
      file.type === "video" || file.type === "audio" ? "media" : pluralType
    }?search=${search.value}`
  );
};
</script>
<template>
  <div ref="target" class="relative w-full md:max-w-[480px]">
    <div
      class="flex h-[52px] flex-1 items-center gap-3 rounded-full px-4 shadow-drop-3"
    >
      <img
        src="/assets/icons/search.svg"
        alt="Search"
        width="24"
        height="24"
        class="flex-shrink-0"
      />
      <Input
        v-model="search"
        @update:model-value="debouncedFn"
        @focus="debouncedFn"
        placeholder="Search..."
        class="body-2 shad-no-focus placeholder:body-1 w-full border-none p-0 shadow-none placeholder:text-light-200"
      />
      <Loader v-if="isLoading" class="size-5 animate-spin text-brand" />

      <template v-if="showResults">
        <ul
          v-if="results.length > 0"
          class="absolute left-0 top-16 max-h-[300px] z-50 flex w-full flex-col gap-3 rounded-[20px] bg-white p-4 overflow-y-auto overflow-x-hidden space-y-2"
        >
          <li
            class="grid grid-cols-9 items-center justify-between w-full"
            v-for="file in results"
            :key="file.$id"
            @click="handleClick(file)"
          >
            <div
              class="flex cursor-pointer items-center gap-4 col-span-6 truncate text-ellipsis w-full"
            >
              <Thumbnail
                :type="file.type"
                :extension="file.extension"
                :url="file.url"
                className="size-9 min-w-9"
              />
              <p
                class="subtitle-2 line-clamp-1 text-light-100 hover:text-brand"
              >
                {{ file.name }}
              </p>
            </div>

            <FormattedDateTime
              :date="file.$createdAt"
              className="caption line-clamp-1 text-light-200 flex justify-end col-span-3"
            />
          </li>
        </ul>
        <p v-else class="body-2 text-center text-light-100">No files found</p>
      </template>
    </div>
  </div>
</template>
