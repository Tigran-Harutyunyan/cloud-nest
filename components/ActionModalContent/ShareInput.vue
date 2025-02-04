<script setup lang="ts">
import { type Models } from "node-appwrite";
import ImageThumbnail from "./ImageThumbnail.vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ShareInputProps {
  file: Models.Document;
}

defineProps<ShareInputProps>();
const emit = defineEmits(["change", "remove"]);

const emailAddress = ref();
</script>
<template>
  <ImageThumbnail :file="file" />

  <div class="!mt-2 space-y-2">
    <p class="subtitle-2 pl-1 text-light-100">Share file with other users</p>
    <Input
      v-model="emailAddress"
      @update:model-value="emit('change', emailAddress)"
      type="email"
      placeholder="Enter email address"
      className="body-2 shad-no-focus h-[52px] w-full rounded-full border px-4 shadow-drop-1"
    />
    <div class="pt-4">
      <div class="flex justify-between">
        <p class="subtitle-2 text-light-100">Shared with</p>
        <p class="subtitle-2 text-light-200">{{ file.users.length }} users</p>
      </div>

      <ul class="pt-2">
        <li
          v-for="email in file.users"
          :key="email"
          class="flex items-center justify-between gap-2"
        >
          <p class="subtitle-2">{{ email }}</p>
          <Button
            @click="emit('remove', email)"
            class="rounded-full bg-transparent text-light-100 shadow-none hover:bg-transparent"
          >
            <img
              src="/icons/remove.svg"
              alt="Remove"
              width="24"
              height="24"
              class="aspect-square rounded-full"
            />
          </Button>
        </li>
      </ul>
    </div>
  </div>
</template>
