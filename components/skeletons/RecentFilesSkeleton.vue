<template>
  <div class="flex flex-col space-y-4 mt-4">
    <div v-for="index in 3" :key="index" class="flex items-center space-x-5">
      <Skeleton class="h-12 w-12 rounded-full shrink-0" />
      <div class="space-y-2 w-full">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full" />
      </div>
    </div>
  </div>
</template>
