<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "vue-sonner";
import FileDetails from "@/components/ActionModalContent/FileDetails.vue";
import ShareInput from "@/components/ActionModalContent/ShareInput.vue";

import { type Models } from "node-appwrite";
import { actionsDropdownItems } from "@/data";
import { constructDownloadUrl, isValidEmail } from "@/lib/utils";
import { useUI } from "@/store/useUI";

interface CardProps {
  file: Models.Document;
}

const props = defineProps<CardProps>();

const emails = ref<string[]>(props.file.users || []);
const name = ref<string>();

const state = reactive({
  isModalOpen: false,
  action: null as ActionType | null,
  isLoading: false,
  newEmail: "",
});

const { update } = useUI();

const setName = () => {
  name.value = props.file.name.replace(`.${props.file.extension}`, "");
};

setName();

const onSelectAction = (actionItem: ActionType) => {
  state.action = actionItem;
  if (["rename", "share", "delete", "details"].includes(actionItem.value)) {
    state.isModalOpen = true;
  }
};

const closeAllModals = () => {
  state.isModalOpen = false;
  state.action = null;
  state.newEmail = "";
};

const handleRemoveUser = async (email: string) => {
  const updatedEmails = emails.value.filter((e) => e !== email);
  const path = `/${useRoute().params.type}`;
  try {
    const response = await $fetch(`/api/file/update-users`, {
      method: "POST",
      body: {
        fileId: props.file.$id,
        emails: updatedEmails,
        path,
      },
    });

    if (response.$id) {
      emails.value = updatedEmails;
      toast.success("Successfully removed user");
      update();
    }
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Server error");
  }
};

const handleAction = async () => {
  if (!state.action) return;

  state.isLoading = true;
  const path = `/${useRoute().params.type}`;

  let payload: Record<string, unknown> = { fileId: props.file.$id, path };

  switch (state.action!.value) {
    case "rename":
      payload = {
        ...payload,
        name: name.value,
        extension: props.file.extension,
      };
      break;

    case "share":
      if (state.newEmail && isValidEmail(state.newEmail)) {
        if (!emails.value.includes(state.newEmail))
          emails.value.push(state.newEmail);
      } else {
        toast.error(`${state.newEmail} is not a valid email`);
        return;
      }
      payload = { ...payload, emails: emails.value };
      break;

    case "delete":
      payload = { ...payload, bucketFileId: props.file.bucketFileId };
      break;
  }

  try {
    const response = await $fetch(`/api/file/${state.action.value}`, {
      method: "POST",
      body: payload,
    });

    if (response.$id || response?.status === "success") {
      closeAllModals();
      update();
      toast.success("Operation success");
    }
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Server error");
  } finally {
    state.isLoading = false;
  }
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child class="shad-no-focus cursor-pointer">
      <img
        src="/assets/icons/dots.svg"
        alt="dots"
        width="34"
        height="34"
        class=""
      />
    </DropdownMenuTrigger>

    <DropdownMenuContent  align="end">
      <DropdownMenuLabel class="max-w-[200px] truncate">
        {{ file.name }}
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        v-for="actionItem in actionsDropdownItems"
        :key="actionItem.value"
        class="shad-dropdown-item"
        @click="() => onSelectAction(actionItem)"
      >
        <NuxtLink
          v-if="actionItem.value === 'download'"
          :to="constructDownloadUrl(file.bucketFileId)"
          :download="file.name"
          class="flex items-center gap-2"
        >
          <img
            :src="actionItem.icon"
            :alt="actionItem.label"
            width="30"
            height="30"
          />
          {{ actionItem.label }}
        </NuxtLink>

        <template v-else>
          <div class="flex items-center gap-2">
            <img
              :src="actionItem.icon"
              alt="actionItem.label"
              width="30"
              height="30"
            />
            {{ actionItem.label }}
          </div>
        </template>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  <Dialog
    v-model:open="state.isModalOpen"
    @updateOpen="state.isModalOpen = false"
  >
    <DialogContent v-if="state.action" class="shad-dialog button">
      <DialogHeader class="flex flex-col gap-3 overflow-hidden">
        <DialogTitle class="text-center text-light-100 overflow-hidden">
          {{ state.action.label }}
        </DialogTitle>

        <Input
          v-if="state.action.value === 'rename'"
          type="text"
          v-model="name"
        />
        <FileDetails v-if="state.action.value === 'details'" :file="file" />
        <ShareInput
          v-if="state.action.value === 'share'"
          :file="file"
          @change="(email: string)=>state.newEmail = email"
          @remove="handleRemoveUser"
        />
        <p
          v-if="state.action.value === 'delete'"
          class="text-center text-light-100 overflow-hidden truncate"
        >
          <p class="mb-2 text-normal">Are you sure you want to delete?</p>
          <span class="font-medium text-brand-100 text-ellipsis truncate">{{
            file.name
          }}</span
          >?
        </p>
      </DialogHeader>

      <DialogFooter
        v-if="['rename', 'delete', 'share'].includes(state.action.value)"
        class="flex flex-col gap-3 md:flex-row overflow-hidden py-1"
      >
        <Button
          @click="closeAllModals"
          class="h-[52px] flex-1 rounded-full bg-white text-light-100 hover:bg-transparent"
        >
          Cancel
        </Button>
        <Button
          @click="handleAction"
          class="primary-btn !mx-0 h-[52px] w-full flex-1 text-white"
        >
          <p class="capitalize truncate text-ellipsis">
            {{ state.action.value }}
          </p>

          <img
            v-if="state.isLoading"
            src="/assets/icons/loader.svg"
            alt="loader"
            width="24"
            height="24"
            class="animate-spin"
          />
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
