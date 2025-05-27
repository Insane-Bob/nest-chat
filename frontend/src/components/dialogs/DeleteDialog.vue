<template>
  <Dialog :open="modelValue" @openChange="val => emit('update:modelValue', val)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this chat? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" @click="close" class="mr-2">Cancel</Button>
        <Button variant="destructive" @click="onConfirm">Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-vue-next';
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue', 'confirm'])

function close() {
  emit('update:modelValue', false)
}

function onConfirm() {
  emit('confirm')
  close()
}
</script>

