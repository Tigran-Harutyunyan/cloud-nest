<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import type { LabelProps } from "radix-vue";
import { useFormField } from "./useFormField";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const props = defineProps<LabelProps & { class?: HTMLAttributes["class"] }>();

const { error, formItemId } = useFormField();
</script>

<template>
  <Label
    :class="
      cn(
        'text-light-100 pt-2 text-[14px] leading-[20px] font-normal w-full',
        error && 'text-destructive',
        props.class
      )
    "
    :for="formItemId"
  >
    <slot />
  </Label>
</template>
