<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Avatar class="w-10 h-10 rounded-full object-cover">
        <AvatarImage v-if="user?.avatar" :src="user.avatar" alt="Avatar" />
        <AvatarFallback>{{ initials }}</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" class="w-48">
      <DropdownMenuLabel>
        Profile of
        <span :style="{ color: userColor }">{{ user?.username }}</span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuItem>
        <RouterLink to="/profile" class="w-full">
            Profile
        </RouterLink>
      </DropdownMenuItem>

      <DropdownMenuItem @click="logout" class="text-destructive">
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserStore } from '@/stores/useUserStore'
import { useAuthGuard } from '@/composables/useAuthGuard'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {Button} from "@/components/ui/button";

useAuthGuard()
const userStore = useUserStore()
userStore.hydrateFromLocalStorage()
const router = useRouter()

const user = computed(() => userStore.user)

const initials = computed(() => {
  if (!user.value?.username) return ''
  return user.value.username.slice(0, 2).toUpperCase()
})

const isValidHex = (color: string) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

const userColor = computed(() =>
    isValidHex(user.value?.color) ? user.value.color : '#000000'
);

function logout() {
  userStore.logout()
  router.push('/login')
}

function goToProfile() {
  router.push('/profile')
}
</script>
