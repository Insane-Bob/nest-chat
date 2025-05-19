<template>
  <div class="max-w-md mx-auto mt-10">
    <h2 class="text-2xl font-bold mb-5">Chats</h2>

    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

    <div v-if="chats.length > 0">
      <Card
          v-for="chat in chats"
          :key="chat._id"
          class="mb-3 p-4"
      >
        <p>{{ chat.participants.map(p => p.username).join(', ') }}</p>
      </Card>
    </div>
    <p v-else>No chats available.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card } from '@/components/ui/card'
import { getChats } from '@/services/chatService.ts'

interface Participant {
  username: string
}

interface Chat {
  _id: string
  participants: Participant[]
}

const chats = ref<Chat[]>([])
const error = ref('')

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      error.value = 'No token found'
      return
    }
    const data = await getChats(token)
    chats.value = data
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch chats'
  }
})
</script>
