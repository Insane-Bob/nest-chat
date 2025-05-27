<template>
  <NavigationMenu>
    <div class="flex flex-col gap-6 max-w-sm p-4">
      <!-- Chat List -->
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarHeader>
              <!-- New Chat Form -->
              <ChatForm/>

              <!-- Search Input -->
              <div class="relative">
                <Input
                    id="search"
                    type="text"
                    placeholder="Search chats or users..."
                    v-model="search"
                    class="pl-10"
                />
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4"/>
              </div>
            </SidebarHeader>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem
                    v-for="chat in filteredChats"
                    :key="chat._id"
                    class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    @click="handleOpenChat(chat._id)"
                >
                  <!-- Avatar -->
                  <div class="flex -space-x-2">
                    <div
                        v-for="participant in chat.participants.filter(p => p._id !== user.user?._id).slice(0, 3)"
                        :key="participant._id"
                        class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white border-2 border-white"
                        :style="{ backgroundColor: getUserColor(participant.color) }"
                        :title="participant.username"
                    >
                      {{ participant.username.charAt(0).toUpperCase() }}
                    </div>
                  </div>

                  <!-- Chat Title -->
                  <span class="truncate flex-1 text-sm font-medium text-muted-foreground">
                    {{ chat.chatName }}
                  </span>

                  <!-- Visibility Icon -->
                  <!--                  <Lock-->
                  <!--                      v-if="chat.visibility === 'PRIVATE'"-->
                  <!--                      class="w-4 h-4 text-gray-400"-->
                  <!--                      title="Private chat"-->
                  <!--                  />-->
                  <!--                  <LockOpen-->
                  <!--                      v-else-if="chat.visibility === 'PUBLIC'"-->
                  <!--                      class="w-4 h-4 text-gray-400"-->
                  <!--                      title="Public chat"-->
                  <!--                  />-->

                  <!-- Delete Icon -->
                  <Button
                      variant="ghost"
                      @click.stop="openDeleteDialog(chat._id)"
                      class="absolute right-2 text-destructive hover:text-red-600 hidden group-hover:block hover:cursor-pointer"
                      title="Delete chat"
                  >
                    <Trash class="w-4 h-4 text-red-500"/>
                  </Button>

                  <DeleteDialog
                      :modelValue="isDeleteDialogOpen"
                      @update:modelValue="val => isDeleteDialogOpen = val"
                      @confirm="confirmDelete"
                  />

                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

    </div>
  </NavigationMenu>
</template>

<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {useRouter} from 'vue-router'
import {ref, onMounted, computed} from 'vue'
import {getChats, deleteChatById} from '@/services/chatService'
import {useToast} from '@/composables/useToastStore'
import {useUserStore} from '@/stores/useUserStore'
import {Lock, LockOpen, Search, Trash} from 'lucide-vue-next'
import ChatForm from "@/components/chat/ChatForm.vue";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import DeleteDialog from "@/components/dialogs/DeleteDialog.vue";

const router = useRouter()
const user = useUserStore()
const {showToast} = useToast()

const chats = ref<Array<any>>([])
const search = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const isDeleteDialogOpen = ref<boolean>(false)
const chatIdToDelete = ref<string | null>(null)

function handleOpenChat(chatId: string) {
  router.push({name: 'ChatDetails', params: {chatId}})
}

function getUserColor(color: string, opacity = 0.8) {
  const isValidHex = (c: string) => /^#([0-9A-F]{3}){1,2}$/i.test(c)
  if (!color || !isValidHex(color)) return `rgba(30, 64, 175, ${opacity})`

  const hex = color.replace('#', '')
  const bigint = parseInt(hex, 16)

  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const filteredChats = computed(() => {
  if (!search.value.trim()) return chats.value;
  return chats.value.filter(chat =>
      chat.chatName.toLowerCase().includes(search.value.toLowerCase())
  );
});

function openDeleteDialog(chatId: string) {
  chatIdToDelete.value = chatId
  isDeleteDialogOpen.value = true
}

async function confirmDelete() {
  if (!chatIdToDelete.value) return;

  const token = localStorage.getItem('jwt');
  if (!token) {
    showToast('User token missing', 'error');
    isDeleteDialogOpen.value = false;
    chatIdToDelete.value = null;
    return;
  }

  try {
    await deleteChatById(chatIdToDelete.value, token);
    showToast('Chat deleted successfully', 'success');
    chats.value = chats.value.filter(chat => chat._id !== chatIdToDelete.value);
  } catch (error) {
    console.error('Delete chat error:', error);
    showToast('Failed to delete chat', 'error');
  } finally {
    isDeleteDialogOpen.value = false;
    chatIdToDelete.value = null;
  }
}

function deleteChat(chatId: string) {
  if (!user.isLoggedIn) {
    showToast('You must be logged in to delete a chat', 'error')
    return
  }

  const token = localStorage.getItem('jwt')
  if (!token) {
    showToast('User token missing', 'error')
    error.value = 'User token missing'
    return
  }

  showToast('Deleting chat...', 'info')

  deleteChatById(chatId)
      .then(() => {
        showToast('Chat deleted successfully', 'success')
        chats.value = chats.value.filter(chat => chat._id !== chatId)
      })
      .catch(() => {
        showToast('Failed to delete chat', 'error')
        error.value = 'Failed to delete chat'
      })
}

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
    const data = await getChats(token);
    chats.value = data;
  } catch {
    showToast('Failed to load chats', 'error')
    error.value = 'Failed to load chats'
  } finally {
    loading.value = false
  }
})

</script>
