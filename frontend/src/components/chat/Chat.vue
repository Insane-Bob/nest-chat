<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(msg, index) in messages" :key="index">{{ msg }}</div>
    </div>
    <Input
        type="text"
        v-model="input"
        @keydown.enter="sendMessage"
    />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script setup>
import { Input } from '@/components/ui/input'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')
const messages = ref([])
const input = ref('')

function sendMessage() {
  if (input.value.trim() === '') return
  socket.emit('sendMessage', input.value)
  input.value = ''
}

onMounted(() => {
  socket.on('receiveMessage', (message) => {
    messages.value.push(message)
  })
})

onBeforeUnmount(() => {
  socket.off('receiveMessage')
})
</script>
