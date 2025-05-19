<template>
  <div class="max-w-md mx-auto mt-10">
    <Card>
      <CardHeader>
        <CardTitle>Chat Details</CardTitle>
        <CardDescription>
          <template v-if="chat">
            Participants: {{ chat.participants.map(p => p.username).join(', ') }}
          </template>
        </CardDescription>
      </CardHeader>

      <CardContent class="h-96 overflow-y-auto space-y-4 bg-gray-50 rounded-md p-4">
        <template v-if="error">
          <p class="text-red-600 text-center">{{ error }}</p>
        </template>

        <template v-else-if="!chat">
          <p>Loading...</p>
        </template>

        <template v-else>
          <div
              v-for="message in chat.messages"
              :key="message._id"
              :class="[
              'max-w-[70%] p-3 rounded-lg shadow',
              isOwnMessage(message) ? 'bg-blue-600 text-white self-end ml-auto' : 'bg-white text-gray-900',
              'whitespace-pre-wrap break-words',
            ]"
          >
            <div class="text-xs font-semibold mb-1">{{ message.sender.username }}</div>
            <div>{{ message.content }}</div>
            <div class="text-xs text-gray-300 mt-1 text-right">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </template>
      </CardContent>

      <CardFooter class="flex gap-2 pt-4 border-t border-gray-200">
        <Input
            v-model="messageContent"
            placeholder="Type your message..."
            as="textarea"
            rows="1"
            class="flex-grow resize-none"
            @keydown.enter.exact.prevent="handleSendMessage"
            aria-label="Message input"
            :disabled="!chat"
        />
        <Button
            :disabled="!messageContent.trim() || !chat"
            @click="handleSendMessage"
            variant="default"
            class="flex items-center gap-1"
        >
          Send
          <SendIcon class="w-5 h-5" />
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send as SendIcon } from 'lucide-vue-next';

import type { Participant, Message, Chat } from '@/types/chat';

import { getChatDetails, sendMessage } from '@/services/api'; // à adapter selon ton architecture

const props = defineProps<{ chatId: string }>();

const chat = ref<Chat | null>(null);
const messageContent = ref('');
const error = ref('');

const currentUserId = ref(''); // Récupère l'id utilisateur actuel du token ou du contexte

function formatTime(timestamp: string) {
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function isOwnMessage(message: Message) {
  return message.sender._id === currentUserId.value;
}

async function fetchChat() {
  error.value = '';
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    // Exemple pour récupérer current user id depuis le token ou autre méthode
    // Ici on simule juste un userId fixe pour l'exemple
    currentUserId.value = 'current-user-id';

    const data = await getChatDetails(token, props.chatId);
    chat.value = data;
  } catch (err: any) {
    error.value = err.message || 'Failed to load chat';
  }
}

async function handleSendMessage() {
  if (!messageContent.value.trim()) return;

  error.value = '';
  try {
    const token = localStorage.getItem('jwt');
    if (!token) throw new Error('No token found');

    if (!chat.value) throw new Error('Chat not loaded');

    const data = await sendMessage(token, props.chatId, messageContent.value.trim());
    chat.value = data; // Mise à jour du chat (messages + participants)
    messageContent.value = '';
  } catch (err: any) {
    error.value = err.message || 'Failed to send message';
  }
}

onMounted(fetchChat);
</script>

<style scoped>
.card-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.1) transparent;
}
.card-content::-webkit-scrollbar {
  width: 8px;
}
.card-content::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.1);
  border-radius: 4px;
}
</style>
