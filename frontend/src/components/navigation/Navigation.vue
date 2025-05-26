<template>
  <NavigationMenu>
    <div class="flex flex-col gap-4 max-w-[280px] p-4">
      <!-- Bouton création de chat -->
      <RouterLink to="/chat/create" class="w-full">
        <Button
            variant="default"
            class="w-full"
            aria-label="Create new chat"
            title="Create new chat"
        >
          Create New Chat
        </Button>
      </RouterLink>

      <Input
          type="search"
          v-model="search"
          placeholder="Search chats..."
          class="w-full px-3 py-2 border rounded mb-6"
          aria-label="Search chats"
      />

      <NavigationMenuList class="flex flex-col gap-2 max-w-[280px]">
        <template v-if="loading">
          <div class="text-center text-gray-500">Loading chats...</div>
        </template>
        <template v-else-if="error">
          <div class="text-center text-red-500">{{ error }}</div>
        </template>
        <template v-else-if="filteredChats.length === 0">
          <div class="text-center text-gray-400">No chats found</div>
        </template>
        <template v-else>
          <NavigationMenuItem
              v-for="chat in filteredChats"
              :key="chat._id"
              class="rounded-md hover:bg-gray-100 transition"
              :title="chat.chatName"
          >
            <Button
                class="w-full flex items-center gap-3 px-3 py-2 cursor-pointer text-left"
                variant="ghost"
                @click="handleOpenChat(chat._id)"
            >
              <div class="flex -space-x-2">
                <div
                    v-for="participant in chat.participants"
                    :key="participant._id"
                    class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white select-none border-2 border-white"
                    :style="{ backgroundColor: getUserColor(participant) }"
                    :title="participant.username"
                >
                  {{ participant.username.charAt(0).toUpperCase() }}
                </div>
              </div>

              <span class="truncate font-medium text-gray-700">{{ chat.chatName }}</span>

              <!-- Visible only if your are a participant or the chat is public -->
              <span>
                <LockOpen
                    v-if="chat.visibility === 'public'"
                    class="w-4 h-4 text-green-500"
                    aria-label="Public chat"
                    title="Public chat"
                />
                <Lock
                    v-else
                    class="w-4 h-4 text-gray-500"
                    aria-label="Private chat"
                    title="Private chat"
                />
              </span>

            </Button>
          </NavigationMenuItem>
        </template>
      </NavigationMenuList>
    </div>
  </NavigationMenu>
</template>

<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { getChats } from '@/services/chatService'
import { useToast } from '@/composables/useToastStore'
import { useUserStore } from '@/stores/useUserStore'
import { Lock, LockOpen } from 'lucide-vue-next'

const router = useRouter()
const user = useUserStore()
const { showToast } = useToast()

const chats = ref<Array<any>>([])
const search = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  if (!user.isLoggedIn) return

  const token = localStorage.getItem('jwt')
  if (!token) {
    showToast('User token missing', 'error')
    error.value = 'User token missing'
    return
  }

  loading.value = true
  error.value = null

  try {
    chats.value = await getChats(token)
  } catch {
    showToast('Failed to load chats', 'error')
    error.value = 'Failed to load chats'
  } finally {
    loading.value = false
  }
})

function handleOpenChat(chatId: string) {
  router.push({ name: 'ChatDetails', params: { chatId } })
}

function isValidHex(color: string) {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color)
}

function getUserColor(participant: { _id: string; color?: string; username?: string }) {
  if (
      participant._id === user.user?._id &&
      user.user?.color &&
      isValidHex(user.user.color)
  ) {
    return user.user.color
  }
  return '#1E40AF'
}

const filteredChats = computed(() => {
  if (!search.value.trim()) {
    return chats.value
  }
  const lowerSearch = search.value.toLowerCase()
  return chats.value.filter(
      (chat) =>
          chat.chatName.toLowerCase().includes(lowerSearch) ||
          chat.participants.some((p: any) =>
              p.username.toLowerCase().includes(lowerSearch)
          )
  )
})
</script>
