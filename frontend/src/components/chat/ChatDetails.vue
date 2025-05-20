<template>
  <div class="max-w-md mx-auto mt-10">
    <Card>
      <CardHeader>
        <CardTitle>
          <div class="flex justify-between items-center">
            <RouterLink
                to="/chats"
                class="flex items-center text-gray-500 hover:text-gray-700"
                aria-label="Back to chat list"
                title="Back to chat list"
            >
              <ChevronLeft class="w-5 h-5"/>
              Go Back
            </RouterLink>
            <h1 class="text-lg font-semibold">{{ chat?.chatName || 'Chat Details' }}</h1>
          </div>
        </CardTitle>
        <CardDescription>
          <template v-if="chat">
            Participants: {{ chat.participants.map(p => p.username).join(', ') }}
          </template>
        </CardDescription>
      </CardHeader>

      <CardContent class="h-96 overflow-y-auto space-y-4 bg-gray-50 rounded-md p-4 card-content">
        <template v-if="error">
          <p class="text-red-600 text-center">{{ error }}</p>
        </template>
        <template v-else-if="!chat">
          <p class="text-center text-gray-500">Loading...</p>
        </template>
        <template v-else>
          <div
              v-for="message in messages"
              :key="message.messageId"
              class="flex max-w-fit p-3 rounded-lg shadow whitespace-pre-wrap break-words"
              :class="{
                'self-end ml-auto bg-blue-600 text-white flex-row-reverse': isOwnMessage(message),
                'bg-white text-gray-900': !isOwnMessage(message),
              }"
          >
            <div class="flex flex-col">
              <!-- Username -->
              <div
                  class="text-xs font-semibold mb-1"
                  :style="{ color: getUserColor(message.sender.color) }"
              >
                {{ message.sender.username }}
              </div>

              <!-- Message -->
              <div>{{ message.content }}</div>

              <!-- Timestamp -->
              <div
                  class="text-xs text-gray-300 mt-1 text-right"
                  :class="{ 'text-white/70': isOwnMessage(message) }"
              >
                {{ formatTime(message.timestamp) }}
              </div>
            </div>
          </div>
        </template>
      </CardContent>

      <CardFooter class="flex gap-2 pt-4 border-t border-gray-200">
        <Input
            v-model="message"
            placeholder="Type your message..."
            as="textarea"
            rows="1"
            class="flex-grow resize-none"
            @keydown.enter.exact.prevent="handleSendMessage"
            aria-label="Message input"
            :disabled="!chat"
        />
        <Button
            :disabled="!message.trim() || !chat"
            @click="handleSendMessage"
            variant="default"
            class="flex items-center gap-1"
        >
          Send
          <SendIcon class="w-5 h-5"/>
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted} from 'vue'
import {useUserStore} from '@/stores/useUserStore'
import {useToast} from "@/composables/useToastStore.ts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Send as SendIcon, ChevronLeft} from 'lucide-vue-next'
import type {Chat, Message} from '@/types/chat'
import {getChatDetails} from '@/services/chatService'
import {useChat} from '@/composables/useChat'

const props = defineProps<{ chatId: string }>()

const chat = ref<Chat | null>(null)
const error = ref('')

const userStore = useUserStore()
const userId = userStore.user?._id
const {messages, message, sendMessage} = useChat(props.chatId)
const {showToast} = useToast()

const isValidHex = (color: string) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

function getUserColor(color?: string) {
  return color && isValidHex(color) ? color : '#000000';
}

function formatTime(timestamp: string | Date) {
  const d = new Date(timestamp)
  return d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
}

function isOwnMessage(message: Message) {
  const currentUserId = userStore.user?._id
  const messageUserId = message.sender._id
  console.log("Comparing IDs:", messageUserId, "vs", currentUserId)
  return messageUserId === currentUserId
}

async function fetchChat() {
  error.value = ''
  try {
    const token = userStore.token
    if (!token) throw new Error('No token found')

    const data = await getChatDetails(token, props.chatId)
    chat.value = data

    messages.value = data.messages || []
  } catch (err: any) {
    error.value = err.message || 'Failed to load chat'
    showToast(error.value, 'error')
  }
}

async function handleSendMessage() {
  if (!message.value.trim()) return
  if (!userStore.user?._id) return

  sendMessage(userStore.user._id, message.value.trim())
  showToast('Message sent', 'success')
}

onMounted(
    async () => {
      await fetchChat()
    }
)
</script>

<style scoped>
.card-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
}

.card-content::-webkit-scrollbar {
  width: 8px;
}

.card-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
</style>