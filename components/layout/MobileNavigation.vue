<script setup lang="ts">
import { cn } from "@/lib/utils";
import { navItems } from "@/data";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";

interface MobileNavigationProps {
  ownerId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}

defineProps<MobileNavigationProps>();

const isOpen = ref(false);
const route = useRoute();
const pathname = route.fullPath;

const logout = async () => {
  try {
    await $fetch("/api/user/logout");
    navigateTo("/sign-in");
  } catch {}
};
</script>

<template>
  <header class="flex h-[60px] justify-between px-5 sm:hidden">
    <img
      src="/assets/icons/logo-full-brand-new.svg"
      alt="logo"
      width="120"
      height="52"
      class="h-auto"
    />

    <Sheet :open="isOpen" @update:open="isOpen = !isOpen">
      <SheetTrigger>
        <img src="/assets/icons/menu.svg" alt="Search" width="30" height="30" />
      </SheetTrigger>
      <SheetContent class="shad-sheet h-screen px-3">
        <SheetTitle>
          <div
            class="my-3 flex items-center gap-2 rounded-full p-1 text-light-100 sm:justify-center sm:bg-brand/10 lg:justify-start lg:p-3"
          >
            <img
              :src="avatar"
              alt="avatar"
              width="44"
              height="44"
              class="aspect-square w-10 rounded-full object-cover"
            />
            <div class="sm:hidden lg:block">
              <p class="subtitle-2 capitalize">{{ fullName }}</p>
              <p class="caption">{{ email }}</p>
            </div>
          </div>
          <Separator class="mb-4 bg-light-200/20" />
        </SheetTitle>

        <nav class="h5 flex-1 gap-1 text-brand">
          <ul class="flex flex-1 flex-col gap-4">
            <NuxtLink
              v-for="{ url, name, icon } in navItems"
              k:ey="name"
              :to="url"
              class="lg:w-full"
            >
              <li
                :class="
                  cn(
                    'flex text-light-100 gap-4 w-full justify-start items-center h5 px-6 h-[52px] rounded-full',
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
                <p>{{ name }}</p>
              </li>
            </NuxtLink>
          </ul>
        </nav>

        <Separator class="my-5 bg-light-200/20" />

        <div class="flex flex-col justify-between gap-5 pb-5">
          <FileUploader :owner-id="ownerId" :account-id="accountId" />
          <Button
            type="submit"
            class="h5 flex h-[52px] w-full items-center gap-4 rounded-full bg-brand/10 px-6 text-brand shadow-none transition-all hover:bg-brand/20"
            @click="logout()"
          >
            <img
              src="/assets/icons/logout.svg"
              alt="logo"
              width="24"
              height="24"
            />
            <p>Logout</p>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  </header>
</template>
