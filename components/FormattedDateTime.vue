<script setup lang="ts">
import { cn, formatDateTime } from "@/lib/utils";

interface FormattedDateTimeProps {
  date: string;
  className?: string;
}

defineProps<FormattedDateTimeProps>();
</script>

<template>
  <p :class="cn('body-1 text-light-200', className)">
    {{ formatDateTime(date) }}
  </p>
</template>
