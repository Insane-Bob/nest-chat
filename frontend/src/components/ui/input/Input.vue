<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useVModel } from '@vueuse/core'
import { ref, computed } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  placeholder?: string
  type?: string
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type || 'text'
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="relative w-full">
    <input
        v-model="modelValue"
        :type="inputType"
        :placeholder="placeholder"
        data-slot="input"
        :class="cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        props.class,
      )"
    />

    <button
        v-if="props.type === 'password'"
        type="button"
        @click="togglePasswordVisibility"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-opacity hover:opacity-80"
    >
      <transition name="fade" mode="out-in">
        <component
            :is="showPassword ? EyeOff : Eye"
            :key="showPassword"
            class="w-4 h-4"
        />
      </transition>
    </button>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
