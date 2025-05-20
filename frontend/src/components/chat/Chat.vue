<template>
  <Card class="max-w-md mx-auto mt-10">
    <CardHeader>
      <CardTitle>Conversation</CardTitle>
      <CardDescription>
        Participants: {{ participantNames }}
      </CardDescription>
    </CardHeader>

    <CardContent class="h-96 overflow-y-auto space-y-4 bg-gray-50 rounded-md p-4 flex flex-col">
      <template v-if="chat && chat.messages.length">
        <div
            v-for="message in chat.messages"
            :key="message._id"
            class="max-w-[70%] p-3 rounded-lg shadow bg-white text-gray-900 whitespace-pre-wrap break-words"
        >
          <div class="text-xs font-semibold mb-1">{{ message.sender.username }}</div>
          <div>{{ message.content }}</div>
          <div class="text-xs text-gray-400 mt-1 text-right">
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
      </template>
      <template v-else>
        <p class="text-center text-gray-500">No messages yet</p>
      </template>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { Chat } from '@/types/chat';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const props = defineProps<{ chat: Chat | null }>();

function formatTime(timestamp: string) {
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const participantNames = computed(() =>
    props.chat?.participants.map((p) => p.username).join(', ') ?? ''
);
</script>
