<script setup lang="ts">
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { calculatePercentage, convertFileSize } from "@/lib/utils";
import DoughnutChart from "@/components/DoughnutChart.vue";

interface ChartProps {
  used: number;
}

defineProps<ChartProps>();
</script>

<template>
  <Card
    class="flex items-center rounded-[20px] bg-brand p-5 text-white md:flex-col xl:flex-row"
  >
    <CardContent class="flex-1 p-0">
      <div
        class="mx-auto flex items-center justify-center aspect-square w-[180px] text-white xl:w-[250px]"
      >
        <DoughnutChart
          :percent="calculatePercentage(used)"
          :strokeWidth="15"
          :width="175"
          :height="175"
          custom-text="Space used"
          :visibleValue="true"
          :customTextSize="10"
          backgroundColor="#fc9091"
          foregroundColor="#ecf6ff"
        />
      </div>
    </CardContent>

    <CardHeader class="flex-1 items-start px-3 py-0 sm:px-5 lg:p-3 xl:pr-5">
      <CardTitle class="h3 font-bold md:text-center lg:text-left"
        >Available Storage</CardTitle
      >
      <CardDescription
        class="subtitle-1 mt-2 w-full text-white/70 md:text-center lg:text-left"
      >
        {{ used ? convertFileSize(used) : "2GB" }} / 2GB
      </CardDescription>
    </CardHeader>
  </Card>
</template>
