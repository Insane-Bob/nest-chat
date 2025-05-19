<template>
  <Toaster />
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'

const props = defineProps({
  toastOptions: {
    type: Object,
  },
})
</script>
