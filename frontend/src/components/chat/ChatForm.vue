<template>
  <Card class="w-96 mx-auto mt-10">
    <CardHeader>
      <CardTitle>Create Chat</CardTitle>
      <CardDescription>Select participants to invite</CardDescription>
    </CardHeader>

    <CardContent>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block mb-1 font-medium">Participants</label>
          <select
              v-model="selectedParticipants"
              multiple
              class="w-full border rounded p-2"
              size="5"
          >
            <option
                v-for="user in users"
                :key="user.id"
                :value="user.id"
            >
              {{ user.username }}
            </option>
          </select>
        </div>

        <Button type="submit" class="w-full bg-blue-600 hover:bg-blue-700">
          Create Chat
        </Button>
      </form>
      <p v-if="message" :class="messageClass" class="mt-4 text-center text-sm">{{ message }}</p>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { findAllUsers } from '@/services/userService'
import { createChat } from '@/services/chatService'
import { useToast } from '@/composables/useToastStore'

const { showToast } = useToast()

const users = ref<Array<{ id: string; username: string }>>([])
const selectedParticipants = ref<string[]>([])
const message = ref('')
const isLoading = ref(false)

const token = localStorage.getItem('jwt')

const messageClass = computed(() => {
  return message.value.startsWith('Error') ? 'text-red-500' : 'text-green-500'
})

onMounted(async () => {
  if (!token) {
    message.value = 'Error: Token not found'
    return
  }
  try {
    users.value = await findAllUsers(token)
  } catch (error: any) {
    message.value = `Error loading users: ${error.message || error}`
  }
})

const handleSubmit = async () => {
  if (!token) {
    message.value = 'Error: Token not found'
    return
  }
  if (selectedParticipants.value.length === 0) {
    message.value = 'Error: No participants selected'
    return
  }
  isLoading.value = true
  message.value = ''
  try {
    await createChat(token, selectedParticipants.value)
    message.value = 'Chat created successfully'
    selectedParticipants.value = []
  } catch (error: any) {
    message.value = `Error: ${error.message || error}`
  } finally {
    isLoading.value = false
  }
}
</script>
