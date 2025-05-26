<template>
  <div class="flex flex-col h-full w-full bg-gray-50">
    <header
        class="flex items-center justify-between px-6 h-16 border-b border-gray-300 bg-white flex-shrink-0"
    >
      <!-- Bouton retour désactivé dans l'exemple, à activer si besoin -->
      <!--
      <RouterLink
        to="/chats"
        class="flex items-center text-gray-500 hover:text-gray-700"
        aria-label="Back to chat list"
        title="Back to chat list"
      >
        <ChevronLeft class="w-5 h-5" />
        Go Back
      </RouterLink>
      -->

      <h1 class="text-lg font-semibold truncate max-w-[60%]">
        {{ chat?.chatName || 'Chat Details' }}
      </h1>

      <div class="text-sm text-gray-600 truncate max-w-[30%]">
        <template v-if="chat">
          Participants: {{ chat.participants.map(p => p.username).join(', ') }}
        </template>
      </div>
    </header>

    <div
        ref="messagesContainer"
        class="flex-grow overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        role="log"
        aria-live="polite"
    >
      <template v-if="error">
        <p class="text-red-600 text-center">{{ error }}</p>
      </template>

      <template v-else-if="!chat">
        <p class="text-center text-gray-500">Loading...</p>
      </template>

      <template v-else>
        <div
            v-for="item in messagesWithDateSeparators"
            :key="item.messageId"
        >
          <template v-if="item.isSeparator">
            <div class="relative flex items-center my-6">
              <div class="flex-grow border-t border-gray-300"></div>
              <span
                  class="mx-4 px-3 py-1 bg-gray-50 text-gray-500 text-sm select-none"
                  style="font-weight: 600;"
              >
                {{ formatDate(item.date) }}
              </span>
              <div class="flex-grow border-t border-gray-300"></div>
            </div>
          </template>
          <template v-else>
            <!-- Message classique -->
            <div
                class="flex items-end max-w-[80%]"
                :class="isOwnMessage(item) ? 'ml-auto flex-row-reverse' : 'mr-auto'"
            >
              <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white select-none"
                  :style="{ backgroundColor: getUserColor(item.sender.color) }"
                  :aria-label="`Avatar for ${item.sender.username}`"
                  role="img"
              >
                {{ item.sender.username.charAt(0).toUpperCase() }}
              </div>

              <div
                  class="ml-2 mr-2 p-3 rounded-2xl whitespace-pre-wrap break-words"
                  :class="{
            'bg-blue-600 text-white rounded-br-none': isOwnMessage(item),
            'bg-white text-gray-900 rounded-bl-none border border-gray-200': !isOwnMessage(item)
          }"
              >
                <div
                    class="text-xs font-semibold mb-1 select-text"
                    :style="{ color: isOwnMessage(item) ? 'inherit' : getUserColor(item.sender.color) }"
                >
                  {{ item.sender.username }}
                </div>

                <div>{{ item.content }}</div>

                <div
                    class="text-xs mt-1 text-right select-none"
                    :class="{ 'text-white/70': isOwnMessage(item), 'text-gray-400': !isOwnMessage(item) }"
                >
                  {{ formatTime(item.timestamp) }}
                </div>
              </div>
            </div>
          </template>
        </div>

        <div v-if="usersTyping.length > 0" class="px-4 py-2 text-sm text-gray-500 italic">
          {{ usersTyping.join(', ') }} {{ usersTyping.length === 1 ? 'is' : 'are' }} typing...
        </div>
      </template>
    </div>

    <!-- Footer input -->
    <footer
        class="flex gap-2 p-4 border-t border-gray-300 bg-white flex-shrink-0"
        role="form"
        aria-label="Send message form"
    >
      <Input
          @input="handleTyping"
          v-model="message"
          type="textarea"
          placeholder="Type your message..."
          rows="1"
          class="flex-grow resize-none rounded-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 px-4 py-2"
          @keydown.enter.exact.prevent="handleSendMessage"
          aria-label="Message input"
          :disabled="!chat"
      />
      <Button
          :disabled="!message.trim() || !chat"
          @click="handleSendMessage"
          class="flex items-center gap-1 rounded-full bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
      >
        <SendIcon class="w-5 h-5" />
      </Button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
import { Send as SendIcon, ChevronLeft } from 'lucide-vue-next'
import { useUserStore } from '@/stores/useUserStore'
import { useToast } from '@/composables/useToastStore'
import { useChat } from '@/composables/useChat'
import {getChatDetails, getMessagesGroupedBy} from '@/services/chatService'
import type { Chat, Message } from '@/types/chat'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const route = useRoute()
const chatId = ref(route.params.chatId as string)

const chat = ref<Chat | null>(null)
const error = ref('')
const userStore = useUserStore()
const { showToast } = useToast()
const { messages, message, sendMessage, notifyTyping, typingUsers } = useChat(chatId.value)
const messagesContainer = ref<HTMLElement | null>(null)

const usersTyping = computed(() => {
  return Array.from(typingUsers.value)
      .map(id => {
        const participant = chat.value?.participants.find(p => p._id === id)
        return participant?.username || 'Someone'
      })
})

const messagesWithDateSeparators = computed(() => {
  if (!messages.value) return []

  let lastDate = ''
  return messages.value.flatMap((msg, index) => {
    const msgDate = new Date(msg.timestamp).toLocaleDateString()

    const showDateSeparator = msgDate !== lastDate
    lastDate = msgDate

    if (showDateSeparator) {
      return [
        { isSeparator: true, date: msgDate, messageId: `separator-${msg.messageId}` },
        { ...msg, isSeparator: false }
      ]
    }
    return [{ ...msg, isSeparator: false }]
  })
})

function isOwnMessage(msg: Message) {
  return msg.sender._id === userStore.user?._id
}

function getUserColor(color?: string) {
  const isValidHex = (c: string) => /^#([0-9A-F]{3}){1,2}$/i.test(c)
  return color && isValidHex(color) ? color : '#1E40AF'
}

function formatTime(timestamp: string | Date) {
  const d = new Date(timestamp)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateString: string | Date) {
  const date = new Date(dateString)
  const formatted = date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}


function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function emitTyping() {
  if (userStore.user?._id) {
    notifyTyping(chatId.value, userStore.user._id)
  }
}

let typingTimeout: number | null = null
function handleTyping() {
  if (typingTimeout) clearTimeout(typingTimeout)
  emitTyping()
  typingTimeout = window.setTimeout(() => {
    typingTimeout = null
  }, 300)
}

async function loadChat(id: string) {
  error.value = ''
  try {
    const token = userStore.token
    if (!token) throw new Error('No token found')
    const data = await getChatDetails(token, id)
    console.log(data);
    chat.value = data
    messages.value = data.messages || []
    scrollToBottom()
  } catch (err: any) {
    error.value = err.message || 'Failed to load chat'
    showToast(error.value, 'error')
  }
}

async function handleSendMessage() {
  if (!message.value.trim() || !userStore.user?._id) return
  sendMessage(userStore.user._id, message.value.trim())
  message.value = ''
  // showToast('Message sent', 'success')
  scrollToBottom()
}

onMounted(() => {
  loadChat(chatId.value)
})

watch(() => route.params.chatId, (newId) => {
  if (typeof newId === 'string') {
    chatId.value = newId
    loadChat(newId)
  }
})

watch(messages, () => {
  scrollToBottom()
})
</script>

<style scoped>
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}
</style>
