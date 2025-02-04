<script setup lang="ts">
import AuthForm from "@/features/user/components/AuthForm.vue";

useHead({
  title: "Sign-in",
});
</script>

<template>
  <NuxtLayout name="auth">
    <AuthForm type="sign-up" />
  </NuxtLayout>
</template>
