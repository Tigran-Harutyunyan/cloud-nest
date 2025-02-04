<script setup lang="ts">
import { type Models } from "node-appwrite";

interface ImageThumbnailProps {
  file: Models.Document;
}

defineProps<ImageThumbnailProps>();
</script>
<template>
  <div
    class="!mb-1 flex items-center gap-3 rounded-xl border border-light-200/40 bg-light-400/50 p-3"
  >
    <Thumbnail :type="file.type" :extension="file.extension" :url="file.url" />
    <div class="flex flex-col overflow-hidden">
      <p class="subtitle-2 mb-1 truncate text-ellipsis">
        {{ file.name }}
      </p>
      <FormattedDateTime :date="file.$createdAt" class="caption" />
    </div>
  </div>
</template>
