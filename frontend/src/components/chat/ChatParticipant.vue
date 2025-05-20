<template>
  <Card class="w-64 shrink-0">
    <CardHeader>
      <CardTitle class="text-sm font-medium">Participants</CardTitle>
      <CardDescription class="text-xs text-gray-500">
        {{ chat?.participants.length }} participant(s)
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-2 max-h-96 overflow-y-auto">
      <template v-if="chat?.participants.length">
        <div
            v-for="p in chat.participants"
            :key="p._id"
            class="flex items-center gap-2"
        >
          <div
              class="w-2.5 h-2.5 rounded-full"
              :style="{ backgroundColor: getUserColor(p.color) }"
          ></div>
          <span class="text-sm text-gray-700 truncate">{{ p.username }}</span>
        </div>
      </template>
      <template v-else>
        <p class="text-sm text-gray-400 italic">No participants</p>
      </template>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import type { Chat } from '@/types/chat'

const props = defineProps<{
  chat: Chat | null
}>()

const isValidHex = (color: string) => /^#([0-9A-F]{3}){1,2}$/i.test(color)

function getUserColor(color?: string) {
  return color && isValidHex(color) ? color : '#999999'
}
</script>
