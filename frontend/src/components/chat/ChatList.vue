<template>
  <div class="flex flex-col w-full max-w-2xl mx-auto space-y-6 px-4 mt-10">
    <RouterLink to="/chat/create" class="w-full">
      <Button
          variant="default"
          class="w-full hover:cursor-pointer"
          aria-label="Create new chat"
          title="Create new chat"
      >
        Create New Chat
      </Button>
    </RouterLink>
    <Card class="w-full">
      <CardHeader>
        <CardTitle>All Chats</CardTitle>
        <CardDescription>
          Choose a chat name and select participants
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Input
            type="search"
            v-model="search"
            placeholder="Search chats..."
            class="w-full px-3 py-2 border rounded mb-6"
            aria-label="Search chats"
        />

        <div class="space-y-4">
          <div v-if="error" class="text-red-600 font-semibold text-center mb-4">{{ error }}</div>

          <Card
              v-for="chat in filteredChats"
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
                  <TrashIcon class="h-5 w-5"/>
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
                  <ChevronRight class="h-4 w-4"/>
                </Button>

                <div
                    class="flex items-center gap-1 text-gray-500 mt-2 text-xs"
                    :title="chat.visibility === 'PRIVATE' ? 'Private chat' : 'Public chat'"
                >
                  <component
                      :is="chat.visibility === 'PRIVATE' ? Lock : Unlock"
                      class="h-4 w-4"
                  />
                  <span>{{ chat.visibility }}</span>
                </div>
              </div>
            </CardHeader>
          </Card>

          <p v-if="!error && filteredChats.length === 0" class="text-center italic text-gray-500 mt-6">
            No chats available.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { getChats, deleteChat } from '@/services/chatService';
import { Button } from '@/components/ui/button';
import { ChevronRight, Trash as TrashIcon, Lock, Unlock } from 'lucide-vue-next';
import {Input} from "@/components/ui/input";

interface Participant {
  _id: string;
  username: string;
}

interface Chat {
  _id: string;
  chatName: string;
  participants: Participant[];
  visibility: 'PRIVATE' | 'PUBLIC';
}

const router = useRouter();
const chats = ref<Chat[]>([]);
const error = ref('');
const search = ref('');


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
  router.push({ name: 'ChatDetails', params: { chatId } });
}

// Computed property pour filtrer les chats en fonction du champ de recherche
const filteredChats = computed(() => {
  if (!search.value.trim()) {
    return chats.value;
  }

  const lowerSearch = search.value.toLowerCase();
  return chats.value.filter(chat =>
      chat.participants.some(p => p.username.toLowerCase().includes(lowerSearch)) ||
      chat.chatName.toLowerCase().includes(lowerSearch)
  );
});
</script>
