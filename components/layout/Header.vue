<script setup lang="ts">
import Search from "@/components/Search.vue";
import FileUploader from "@/components/FileUploader.vue";

interface HeaderProps {
  userId: string;
  accountId: string;
}

defineProps<HeaderProps>();

const logout = async () => {
  try {
    const response = await $fetch("/api/user/logout");
    navigateTo("/sign-in");
  } catch {}
};
</script>

<template>
  <header
    class="hidden items-center justify-between gap-5 p-5 sm:flex lg:py-7 xl:gap-10"
  >
    <Search />
    <div class="flex-center min-w-fit gap-4">
      <FileUploader :owner-id="userId" :account-id="accountId" />
      <form @submit.prevent="logout">
        <Button
          type="submit"
          class="flex-center h-[52px] min-w-[54px] items-center rounded-full bg-brand/10 p-0 text-brand shadow-none transition-all hover:bg-brand/20"
        >
          <img
            src="/assets/icons/logout.svg"
            alt="logo"
            width="24"
            height="24"
            class="w-6"
          />
        </Button>
      </form>
    </div>
  </header>
</template>
