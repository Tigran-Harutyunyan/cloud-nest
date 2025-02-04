<script setup lang="ts">
import { cn, getFileIcon } from "@/lib/utils";

interface TumbnailProps {
  type: string;
  extension: string;
  url?: string;
  imageClassName?: string;
  className?: string;
}

const props = defineProps<TumbnailProps>();
const isImage = computed(
  () => props.type === "image" && props.extension !== "svg"
);

const imageClasses = computed(() =>
  cn(
    "size-8 object-contain",
    props.imageClassName,
    isImage && "size-full object-cover object-center"
  )
);
</script>

<template>
  <figure
    :class="
      cn(
        'flex-center size-[50px] min-w-[50px] overflow-hidden rounded-full bg-brand/10',
        className
      )
    "
  >
    <img
      :src="isImage ? url : getFileIcon(extension, type)"
      alt="thumbnail"
      width="100"
      height="100"
      :class="imageClasses"
    />
  </figure>
</template>
