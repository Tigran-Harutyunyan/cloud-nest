<script setup lang="ts">
import { cn, getFileIcon } from "@/lib/utils";
const data = [
  { title: "Documents", icon: "/icons/file-document-light.svg" },
  { title: "Images", icon: "/icons/file-image-light.svg" },
  { title: "Media", icon: "/icons/file-video-light.svg" },
  { title: "Others", icon: "/icons/file-other-light.svg" },
];
</script>

<template>
  <ul class="mt-6 grid grid-cols-1 gap-4 xl:mt-10 xl:grid-cols-2 xl:gap-9">
    <li
      v-for="item in data"
      class="relative mt-6 rounded-[20px] bg-white p-5 transition-all hover:scale-105"
    >
      <div class="space-y-4">
        <div class="flex justify-between gap-3">
          <img
            :src="item.icon"
            width="100"
            height="100"
            alt="uploaded image"
            class="absolute -left-3 top-[-25px] z-10 w-[190px] object-contain"
          />
          <div class="relative z-20 w-full flex justify-end">
            <Skeleton class="h-4 w-[60px] ml-auto" />
          </div>
        </div>

        <h5 class="h5 relative z-20 text-center">
          {{ item.title }}
        </h5>
        <Separator class="bg-light-400" />
        <Skeleton class="h-4 rounded-full w-[70%] mx-auto" />
      </div>
    </li>
  </ul>
</template>
