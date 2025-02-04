<script setup lang="ts">
import Sidebar from "@/components/layout/Sidebar.vue";
import Header from "@/components/layout/Header.vue";
import MobileNavigation from "@/components/layout/MobileNavigation.vue";

const { data: currentUser } = useFetch("/api/user");

if (!currentUser) navigateTo("/sign-in");
</script>
<template>
  <main v-if="currentUser" class="flex h-screen">
    <Sidebar
      :full-name="currentUser.fullName"
      :avatar="currentUser.avatar"
      :email="currentUser.email"
    />
    <section class="flex h-full flex-1 flex-col">
      <MobileNavigation
        :owner-id="currentUser.$id"
        :account-id="currentUser.accountId"
        :full-name="currentUser.fullName"
        :avatar="currentUser.avatar"
        :email="currentUser.email"
      />
      <Header :user-id="currentUser.$id" :account-id="currentUser.accountId" />
      <div
        class="remove-scrollbar h-full flex-1 overflow-auto bg-light-400 px-5 py-7 sm:mr-7 sm:rounded-[30px] md:mb-7 md:px-9 md:py-10"
      >
        <slot />
      </div>
    </section>
  </main>
</template>
