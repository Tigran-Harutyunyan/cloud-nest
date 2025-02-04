<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  PinInput,
  PinInputGroup,
  PinInputInput,
} from "@/components/ui/pin-input";
import { toast } from "vue-sonner";

interface OTPModalProps {
  accountId: string;
  email?: string;
}

const props = defineProps<OTPModalProps>();
const isOpen = ref(true);
const password = ref();
const isLoading = ref(false);

const handleComplete = async () => {
  isLoading.value = true;

  const payload = {
    accountId: props.accountId,
    password: password.value.join(""),
  };

  try {
    const sessionId = await $fetch("/api/user/verify", {
      method: "POST",
      body: payload,
    });
    if (sessionId) navigateTo("/");
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : "Failed to verify OTP";
    toast(errMessage);
  } finally {
    isLoading.value = false;
  }
};

const handleResendOtp = async () => {
  try {
    const sessionId = await $fetch("/api/user/send-email", {
      method: "POST",
      body: { email: props.email },
    });
    debugger;

    if (sessionId) navigateTo("/");
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : "Failed to resend";
    toast(errMessage);
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <AlertDialog :open="isOpen" @openChange="isOpen = false">
    <AlertDialogContent
      class="space-y-4 max-w-[95%] sm:w-fit rounded-xl md:rounded-[30px] px-4 md:px-8 py-10 bg-white outline-none"
    >
      <AlertDialogHeader class="relative flex justify-center">
        <AlertDialogTitle class="h2 text-center">
          Enter Your OTP
          <img
            src="/assets/icons/close-dark.svg"
            alt="close"
            :width="20"
            :height="20"
            @click="isOpen = false"
            class="absolute -right-1 -top-7 cursor-pointer sm:-right-2 sm:-top-4"
          />
        </AlertDialogTitle>
        <AlertDialogDescription class="subtitle-2 text-center text-light-100">
          We&apos;ve sent a code to
          <span class="pl-1 text-brand">{{ email }}</span>
        </AlertDialogDescription>
      </AlertDialogHeader>

      <PinInput v-model="password" @complete="handleComplete">
        <PinInputGroup class="w-full flex gap-1 sm:gap-2 justify-between">
          <PinInputInput
            v-for="(id, index) in 6"
            :key="id"
            :index="index"
            class="text-[40px] font-medium rounded-xl ring-brand shadow-drop-1 text-brand-100 justify-center flex border-2 border-light-300 size-12 md:size-16 gap-5"
          />
        </PinInputGroup>
      </PinInput>

      <AlertDialogFooter>
        <div class="flex w-full flex-col gap-4">
          <AlertDialogAction
            @click="handleComplete"
            class="bg-brand button hover:bg-brand-100 transition-all rounded-full text-white h-12"
            type="button"
          >
            Submit
            <Spinner v-if="isLoading" class="ml-2" />
          </AlertDialogAction>

          <div class="subtitle-2 mt-2 text-center text-light-100">
            Didn&apos;t get a code?
            <Button
              type="button"
              variant="link"
              class="pl-1 text-brand"
              @click="handleResendOtp"
            >
              Click to resend
            </Button>
          </div>
        </div>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
