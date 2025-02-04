<script setup lang="ts">
import { Toaster } from "vue-sonner";
useSeoMeta({
  title: "Cloud nest",
  description: "Cloud-nest The only storage solution you need.",
});
</script>
<template>
  <NuxtLoadingIndicator color="#EA6365" />
  <NuxtPage />
  <Toaster
    class="pointer-events-auto"
    position="bottom-right"
    :rich-colors="true"
    :close-button="true"
  />
</template>
