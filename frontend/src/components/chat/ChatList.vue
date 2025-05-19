<template>
  <div class="flex flex-col items-center mt-10 w-full max-w-md space-y-6 px-4">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>All Chats</CardTitle>
        <CardDescription>
          Choose a chat name and select participants
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div class="space-y-4">
          <div v-if="error" class="text-red-600 font-semibold text-center mb-4">{{ error }}</div>

          <Card
              v-for="chat in chats"
              :key="chat._id"
          >
            <CardHeader class="flex justify-between items-start">
              <div>
                <CardTitle class="text-lg font-semibold text-gray-900">
                  {{ chat.chatName }}
                </CardTitle>
                <CardDescription class="text-sm text-gray-700 mt-1 flex items-center gap-2">
                  <span>Participants:</span>
                  <span class="font-medium text-blue-600/30 bg-blue-100/30 px-2 py-0.5 rounded-full text-xs">
                    {{ chat.participants.length }}
                  </span>
                </CardDescription>
                <p class="mt-1 text-sm text-gray-600 truncate max-w-xs">
                  {{ chat.participants.map(p => p.username).join(', ') }}
                </p>
              </div>

              <div class="flex flex-col items-center space-y-2">
                <Button
                    variant="outline"
                    size="sm"
                    class="text-red-500 hover:text-red-700 border-red-500"
                    aria-label="Delete chat"
                    title="Delete chat"
                    @click="handleDeleteChat(chat._id)"
                >
                  <TrashIcon class="h-5 w-5" />
                </Button>

                <Button
                    variant="default"
                    size="sm"
                    class="flex items-center gap-1"
                    aria-label="Open chat"
                    title="Open chat"
                    @click="handleOpenChat(chat._id)"
                >
                  Chat
                  <ChevronRight class="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>

          <p v-if="!error && chats.length === 0" class="text-center italic text-gray-500 mt-6">
            No chats available.
          </p>
        </div>
      </CardContent>
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
} from '@/components/ui/card';
import { getChats, deleteChat } from '@/services/chatService';

import { Button } from '@/components/ui/button';
import { ChevronRight, Trash as TrashIcon } from 'lucide-vue-next';

interface Participant {
  _id: string;
  username: string;
}

interface Chat {
  _id: string;
  chatName: string;
  participants: Participant[];
}

const chats = ref<Chat[]>([]);
const error = ref('');

onMounted(async () => {
  try {
    const token = localStorage.getItem('jwt');
    if (token) {
      const data = await getChats(token);
      chats.value = data;
    } else {
      error.value = 'No token found';
    }
  } catch (err: any) {
    error.value = err.message || 'Error fetching chats';
  }
});

async function handleDeleteChat(chatId: string) {
  const token = localStorage.getItem('jwt');
  if (!token) {
    error.value = 'No token found';
    return;
  }
  try {
    await deleteChat(token, chatId);
    chats.value = chats.value.filter(c => c._id !== chatId);
  } catch (err: any) {
    error.value = err.message || 'Error deleting chat';
  }
}

function handleOpenChat(chatId: string) {
  alert(`Open chat with id: ${chatId}`);
}
</script>
