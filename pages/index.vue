<script setup lang="ts">
import Chart from "@/components/Chart.vue";
import { getUsageSummary } from "@/lib/utils";
import { storeToRefs } from "pinia";
import { useUI } from "@/store/useUI";
import TotalSpaceSkeleton from "@/components/skeletons/TotalSpaceSkeleton.vue";
import RecentFilesSkeleton from "@/components/skeletons/RecentFilesSkeleton.vue";
import SummarySkeleton from "@/components/skeletons/SummarySkeleton.vue";

definePageMeta({
  middleware: ["auth"],
  auth: { guestRedirectUrl: "/sign-in" },
});

const { updateCount } = storeToRefs(useUI());
const queryClient = useQueryClient();

const { data: files, isPending: isFilesPending } = useQuery({
  queryKey: ["files"],
  queryFn: () =>
    $fetch("/api/files", {
      method: "POST",
      body: { limit: 10 },
    }),
});

const { data: totalSpace, isPending: isTotalsPending } = useQuery({
  queryKey: ["space-used"],
  queryFn: () => $fetch<TotalSpaceType>("/api/files/space-used"),
});

const usageSummary = computed(() =>
  totalSpace.value ? getUsageSummary(totalSpace.value) : []
);

watch(
  () => updateCount.value,
  () => {
    queryClient.invalidateQueries({ queryKey: ["files"] });
    queryClient.invalidateQueries({ queryKey: ["space-used"] });
  }
);
</script>
<template>
  <NuxtLayout name="default">
    <div
      class="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 xl:gap-10"
    >
      <section>
        <TotalSpaceSkeleton v-if="isTotalsPending" />
        <Chart v-if="totalSpace" :used="totalSpace?.used" />

        <SummarySkeleton v-if="isTotalsPending" />
        <ul
          v-else
          class="mt-6 grid grid-cols-1 gap-4 xl:mt-10 xl:grid-cols-2 xl:gap-9"
        >
          <SummaryItem v-for="summary in usageSummary" :summary="summary" />
        </ul>
      </section>

      <section class="h-full rounded-[20px] bg-white p-5 xl:p-8">
        <h2 class="h3 xl:h2 text-light-100">Recent files uploaded</h2>

        <RecentFilesSkeleton v-if="isFilesPending" />
        <template v-else>
          <ul
            v-if="files?.documents?.length > 0"
            class="mt-5 flex flex-col gap-5"
          >
            <RecentDocument
              v-for="file in files.documents"
              :file="file"
              :key="file.$id"
            />
          </ul>

          <p v-else class="body-1 mt-10 text-center text-light-200">
            No files uploaded
          </p>
        </template>
      </section>
    </div>
  </NuxtLayout>
</template>
