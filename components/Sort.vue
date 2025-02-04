<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortTypes } from "@/data";

const { modifyQueryParam } = useModifyQueryParam();
const route = useRoute();

const selected = computed(() =>
  route.query?.sort
    ? sortTypes.find((item) => item.value === route.query?.sort)?.value
    : sortTypes[0].value
);

const handleSort = (value: string) => {
  setTimeout(() => {
    modifyQueryParam(route.params.type as string, "sort", value);
  }, 300);
};
</script>
<template>
  <Select v-model="selected" @update:model-value="handleSort">
    <SelectTrigger
      class="shad-no-focus h-11 w-full rounded-[8px] border-transparent bg-white !shadow-sm sm:w-[210px]"
    >
      <SelectValue :placeholder="selected" />
    </SelectTrigger>
    <SelectContent class="!shadow-drop-3">
      <SelectItem
        v-for="sort in sortTypes"
        :key="sort.label"
        class="cursor-pointer"
        :value="sort.value"
      >
        {{ sort.label }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
