<script setup lang="ts">
import { type Models } from "node-appwrite";
import ActionDropdown from "@/components/ActionDropdown.vue";
import Thumbnail from "@/components/Thumbnail.vue";

interface RecentFilePros {
  file: Models.Document;
}

defineProps<RecentFilePros>();
</script>

<template>
  <NuxtLink
    :key="file.$id"
    :to="file.url"
    target="_blank"
    class="flex items-center gap-3"
  >
    <Thumbnail :type="file.type" :extension="file.extension" :url="file.url" />

    <div class="flex w-full justify-between overflow-hidden">
      <div class="flex flex-col gap-1 flex-1 mr-2 text-ellipsis truncate">
        <p
          class="subtitle-2 line-clamp-1 w-full text-light-100 text-ellipsis truncate overflow-hidden"
        >
          {{ file.name }}
        </p>
        <FormattedDateTime :date="file.$createdAt" className="caption" />
      </div>
      <ActionDropdown :file="file" />
    </div>
  </NuxtLink>
</template>
