import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useToast() {
  const toastStore = useToastStore()

  function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    toastStore.addToast({ message, type })
  }

  return { showToast }
}