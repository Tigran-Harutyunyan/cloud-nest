<script setup lang="ts">
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { pathsEnum } from "@/constants";
import Spinner from "@/components/Spinner.vue";
import OtpModal from "@/features/user/components/OtpModal.vue";
import { useAuthForm } from "@/features/user/composables/useAuthForm";

interface AuthForm {
  type: FormType;
}

const props = defineProps<AuthForm>();

const {
  formTitle,
  linkText,
  isLoading,
  errorMessage,
  accountId,
  isSignUpForm,
  formValues,
  configure,
  submitForm,
} = useAuthForm(props.type);

configure({
  validateOnBlur: false,
  validateOnChange: false,
  validateOnInput: false,
  validateOnModelUpdate: false,
});
</script>

<template>
  <form
    novalidate
    @submit.prevent="submitForm"
    class="flex max-h-[800px] w-full max-w-[580px] flex-col justify-center transition-all h-full"
  >
    <h1 class="h1 text-center text-light-100 md:text-left">
      {{ formTitle }}
    </h1>
    <div class="space-y-8 mt-8">
      <div v-if="isSignUpForm">
        <FormField name="fullName" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="text"
                placeholder="Enter your full name"
              />
            </FormControl>
          </FormItem>
          <FormMessage class="mt-2" />
        </FormField>
      </div>
      <div>
        <FormField name="email" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="text"
                placeholder="Enter your email"
              />
            </FormControl>
          </FormItem>
          <FormMessage class="mt-2" />
        </FormField>
      </div>
      <Button
        type="submit"
        class="primary-btn h-[66px] w-full text-white"
        :disabled="isLoading"
      >
        {{ formTitle }}
        <Spinner v-if="isLoading" class="ml-2" />
      </Button>
    </div>

    <p
      v-if="errorMessage"
      class="body-2 mx-auto w-fit rounded-xl bg-error/5 px-8 py-4 text-center text-error"
    >
      *{{ errorMessage }}
    </p>
    <div class="body-2 flex justify-center mt-8">
      <p class="text-light-100">
        {{
          !isSignUpForm ? "Don't have an account?" : "Already have an account?"
        }}
      </p>
      <NuxtLink
        :to="isSignUpForm ? pathsEnum.SIGN_IN : pathsEnum.SIGN_UP"
        class="ml-1 font-medium text-brand"
      >
        {{ linkText }}
      </NuxtLink>
    </div>
  </form>

  <OtpModal
    v-if="accountId"
    :email="formValues.email"
    :account-id="accountId"
  />
</template>
