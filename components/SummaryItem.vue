<script setup lang="ts">
import { Separator } from "@/components/ui/separator";
import { convertFileSize } from "@/lib/utils";

interface SummaryItemPros {
  summary: {
    url: string;
    title: string;
    icon: string;
    size: number;
    latestDate: string;
  };
}

defineProps<SummaryItemPros>();
</script>

<template>
  <NuxtLink
    :to="summary.url"
    :key="summary.title"
    class="relative mt-6 rounded-[20px] bg-white p-5 transition-all hover:scale-105"
  >
    <div class="space-y-4">
      <div class="flex justify-between gap-3">
        <img
          :src="summary.icon"
          width="100"
          height="100"
          alt="uploaded image"
          class="absolute -left-3 top-[-25px] z-10 w-[190px] object-contain"
        />
        <h4 class="h4 relative z-20 w-full text-right">
          {{ convertFileSize(summary.size) || 0 }}
        </h4>
      </div>

      <h5 class="h5 relative z-20 text-center">
        {{ summary.title }}
      </h5>
      <Separator class="bg-light-400" />
      <FormattedDateTime :date="summary.latestDate" className="text-center" />
    </div>
  </NuxtLink>
</template>
