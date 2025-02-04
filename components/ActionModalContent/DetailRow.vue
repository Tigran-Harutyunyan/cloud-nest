<script setup lang="ts">
interface DetailRowProps {
  label: string;
  value: string;
}

defineProps<DetailRowProps>();
</script>
<template>
  <div class="flex">
    <p class="body-2 w-[30%] text-light-100 text-left">{{ label }}</p>
    <p class="subtitle-2 flex-1 text-left">{{ value }}</p>
  </div>
</template>
