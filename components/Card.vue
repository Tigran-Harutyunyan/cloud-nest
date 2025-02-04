<script setup lang="ts">
import { type Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail.vue";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateTime.vue";
import ActionDropdown from "@/components/ActionDropdown.vue";

interface CardProps {
  file: Models.Document;
}

defineProps<CardProps>();
</script>

<template>
  <NuxtLink
    :to="file.url"
    target="_blank"
    class="flex cursor-pointer flex-col gap-6 rounded-[18px] bg-white p-5 shadow-sm transition-all hover:shadow-drop-3"
  >
    <div className="flex justify-between">
      <Thumbnail
        :type="file.type"
        :extension="file.extension"
        :url="file.url"
        className="!size-20"
      />
      <div class="flex flex-col items-end justify-between">
        <ActionDropdown :file="file" />
        <p class="body-1">{{ convertFileSize(file.size) }}</p>
      </div>
    </div>

    <div class="flex flex-col gap-2 text-light-100 overflow-hidden w-full">
      <p
        class="subtitle-2 text-ellipsis truncate overflow-hidden whitespace-nowrap w-full"
      >
        {{ file.name }}
      </p>
      <FormattedDateTime
        :date="file.$createdAt"
        class="body-2 text-light-100"
      />
      <p class="caption line-clamp-1 text-light-200">
        By: {{ file.owner.fullName }}
      </p>
    </div>
  </NuxtLink>
</template>
