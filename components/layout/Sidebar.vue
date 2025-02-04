<script setup lang="ts">
import { cn } from "@/lib/utils";
import { navItems } from "@/data";

interface SidebarProps {
  fullName: string;
  avatar: string;
  email: string;
}
defineProps<SidebarProps>();

const route = useRoute();
const pathname = route.fullPath;
</script>

<template>
  <aside
    class="remove-scrollbar hidden h-screen w-[90px] flex-col overflow-auto px-5 py-7 sm:flex lg:w-[280px] xl:w-[325px]"
  >
    <NuxtLink to="/">
      <img
        src="/assets/icons/logo-full-brand-new.svg"
        alt="logo"
        width="160"
        height="50"
        class="hidden h-auto lg:block"
      />

      <img
        src="/assets/icons/logo-brand.svg"
        alt="logo"
        width="52"
        height="52"
        class="lg:hidden"
      />
    </NuxtLink>

    <nav class="h5 mt-9 flex-1 gap-1 text-brand">
      <ul class="flex flex-1 flex-col gap-6">
        <NuxtLink
          v-for="{ url, name, icon } in navItems"
          :key="name"
          :to="url"
          class="lg:w-full"
        >
          <li
            :class="
              cn(
                'flex text-light-100 gap-4 rounded-xl lg:w-full justify-center lg:justify-start items-center h5 lg:px-[30px] h-[52px] lg:rounded-full',
                route.path === url && 'bg-brand text-white shadow-drop-2'
              )
            "
          >
            <img
              :src="icon"
              :alt="name"
              width="24"
              height="24"
              :class="
                cn(
                  'w-6 filter invert opacity-25',
                  route.path === url && 'invert-0 opacity-100'
                )
              "
            />
            <p class="hidden lg:block">{{ name }}</p>
          </li>
        </NuxtLink>
      </ul>
    </nav>

    <img
      src="/assets/images/files-2.png"
      alt="logo"
      width="506"
      height="418"
      class="w-full"
    />

    <div
      class="mt-4 flex items-center justify-center gap-2 rounded-full bg-brand/10 p-1 text-light-100 lg:justify-start lg:p-3"
    >
      <img
        :src="avatar"
        alt="Avatar"
        width="44"
        height="44"
        class="aspect-square w-10 rounded-full object-cover"
      />
      <div class="hidden lg:block overflow-hidden">
        <p class="subtitle-2 capitalize">{{ fullName }}</p>
        <p class="caption">{{ email }}</p>
      </div>
    </div>
  </aside>
</template>
