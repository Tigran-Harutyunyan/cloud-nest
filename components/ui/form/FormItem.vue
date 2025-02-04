<script lang="ts" setup>
import { type HTMLAttributes, provide } from "vue";
import { useId } from "radix-vue";
import { FORM_ITEM_INJECTION_KEY } from "./injectionKeys";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const id = useId();
provide(FORM_ITEM_INJECTION_KEY, id);
</script>

<template>
  <div
    :class="
      cn(
        'space-y-2 flex h-[78px] flex-col justify-center rounded-xl border border-light-300 px-4 shadow-drop-1',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
