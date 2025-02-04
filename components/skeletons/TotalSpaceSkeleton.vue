<template>
  <div
    class="border shadow-sm flex items-center rounded-[20px] bg-brand p-5 text-white md:flex-col xl:flex-row"
  >
    <div class="flex-1 p-0">
      <div
        class="mx-auto flex items-center justify-center aspect-square w-[180px] text-white xl:w-[250px]"
      >
        <Skeleton class="h-[165px] w-[165px] rounded-full shrink-0 mx-auto" />
      </div>
    </div>
    <div
      class="flex flex-col gap-y-1.5 p-6 flex-1 items-start px-3 py-0 sm:px-5 lg:p-3 xl:pr-5"
    >
      <h3
        class="text-2xl leading-none tracking-tight h3 font-bold md:text-center lg:text-left"
      >
        Available Storage
      </h3>
      <p
        class="text-sm subtitle-1 mt-2 w-full text-white/70 md:text-center lg:text-left"
      >
        <Skeleton class="h-6 rounded-full" />
      </p>
    </div>
  </div>
</template>
