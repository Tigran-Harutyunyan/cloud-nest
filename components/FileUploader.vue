<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Thumbnail from "@/components/Thumbnail.vue";
import { MAX_FILE_SIZE } from "@/constants";
import { useDropZone } from "@vueuse/core";
import { toast } from "vue-sonner";
import { useUI } from "@/store/useUI";

interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

const props = defineProps<FileUploaderProps>();

const dropZoneRef = ref<HTMLDivElement>();
const files = ref<File[] | null>([]);
const imageElementRef = ref(null);

const { update } = useUI();

const onDrop = async (acceptedFiles: File[] | null) => {
  files.value = acceptedFiles ? Array.from(acceptedFiles) : null;

  if (files.value === null) return;

  const uploadPromises = files.value.map(async (file, idx, arr) => {
    if (file.size > MAX_FILE_SIZE) {
      arr = arr?.filter((f) => f.name !== file.name);
      toast.error(`${file.name} is too large`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("ownerId", props.ownerId);
    formData.append("accountId", props.accountId);

    return $fetch("/api/file/upload", {
      method: "POST",
      body: formData,
    }).then((uploadedFile) => {
      if (uploadedFile && files.value) {
        files.value = files.value.filter((f) => f.name !== file.name);
      }
    });
  });

  await Promise.all(uploadPromises);
  update();
};

useDropZone(dropZoneRef, {
  onDrop,
});

const handleRemoveFile = (fileName: string) => {
  if (!files.value) return;
  files.value = files.value.filter((file) => file.name !== fileName);
};

const onInputChange = () => {
  onDrop(imageElementRef.value?.files);
};
</script>

<template>
  <div class="cursor-pointer" ref="dropZoneRef">
    <input
      type="file"
      accept="*"
      ref="imageElementRef"
      @change="onInputChange"
      class="hidden"
    />
    <Button
      type="button"
      @click="imageElementRef?.click()"
      :class="
        cn(
          'primary-btn h-[52px] gap-2 px-10 shadow-drop-1 text-white',
          className
        )
      "
    >
      <img src="/assets/icons/upload.svg" alt="upload" width="24" height="24" />
      <p>Upload</p>
    </Button>

    <ul
      v-if="files && files?.length > 0"
      class="fixed bottom-10 right-10 z-50 flex size-full h-fit max-w-[480px] flex-col gap-3 rounded-[20px] bg-white p-7 shadow-drop-3"
    >
      <h4 class="h4 text-light-100">Uploading</h4>

      <li
        v-for="(file, index) in files"
        :key="`${file.name}-${index}`"
        class="flex items-center justify-between gap-3 rounded-xl p-3 shadow-drop-3"
      >
        <div class="flex items-center gap-3">
          <Thumbnail
            :type="getFileType(file.name).type"
            :extension="getFileType(file.name).extension"
            :url="convertFileToUrl(file)"
          />

          <div class="subtitle-2 mb-2 line-clamp-1 max-w-[300px]">
            {{ file.name }}
            <img
              src="/assets/icons/file-loader.gif"
              width="80"
              height="26"
              alt="Loader"
            />
          </div>
        </div>

        <img
          src="/assets/icons/remove.svg"
          width="24"
          height="24"
          alt="Remove"
          @click="handleRemoveFile(file.name)"
        />
      </li>
    </ul>
  </div>
</template>
