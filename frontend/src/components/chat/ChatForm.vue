<template>
  <div class="flex items-center justify-center min-h-screen px-4">
    <Card class="w-96">
      <CardHeader>
        <CardTitle>Create Chat</CardTitle>
        <CardDescription>
          Choose a chat name and select participants
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <Input
                id="chatName"
                v-model="chatName"
                type="text"
                placeholder="Chat name"
                class="w-full"
            />
          </div>

          <div class="mb-4">
            <Label for="visibility" class="mb-1 block text-gray-600">
              Visibility
            </Label>

            <Select
                :modelValue="visibility"
                @update:modelValue="val => visibility = val"
                id="visibility"
                class="w-full"
            >
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Visibility Options</SelectLabel>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div class="mb-4">
            <Label for="participants" class="mb-1 block text-gray-600">
              Participants
            </Label>

            <Select
                :modelValue="selectedParticipantId"
                @update:modelValue="val => selectedParticipantId = val"
                id="participants"
                class="w-full"
            >
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a participant" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Users</SelectLabel>
                  <SelectItem
                      v-for="user in allUsers"
                      :key="user.userId"
                      :value="user.userId"
                  >
                    {{ user.username }}
                    <span v-if="user.connected" class="text-green-500">
                      (Online)
                    </span>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" class="w-full bg-blue-600 hover:bg-blue-700">
            Create Chat
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <p
            v-if="message"
            :class="{
            'text-green-600': !isError,
            'text-red-600': isError,
          }"
            class="text-center text-sm"
        >
          {{ message }}
        </p>
      </CardFooter>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { findAllUsers } from '@/services/userService';
import { createChat } from '@/services/chatService';
import { useRouter } from 'vue-router';
import { useToast } from "@/composables/useToastStore";

interface User {
  _id: string;
  username: string;
}

const { showToast } = useToast();

const router = useRouter()
const chatName = ref('');
const selectedParticipantId = ref('');
const visibility = ref('PRIVATE');
const allUsers = ref<User[]>([]);
const message = ref('');
const isError = ref(false);

onMounted(async () => {
  try {
    const token = localStorage.getItem('jwt');
    if (token) {
      allUsers.value = await findAllUsers(token);
    }
  } catch {
    message.value = 'Failed to load users';
    isError.value = true;
  }
});

const handleSubmit = async () => {
  if (!chatName.value.trim() || !selectedParticipantId.value) {
    message.value = 'Please fill all fields and select a participant';
    isError.value = true;
    return;
  }

  try {
    const token = localStorage.getItem('jwt');
    if (!token) throw new Error('No token found');

    await createChat(token, {
      chatName: chatName.value.trim(),
      participants: [selectedParticipantId.value],
      visibility: visibility.value,
    });

    message.value = 'Chat created successfully';
    isError.value = false;
    chatName.value = '';
    selectedParticipantId.value = '';
    router.push('/chats')
    showToast('Chat created successfully', 'success');
  } catch (err: any) {
    message.value = `Error: ${err.message || 'Unknown error'}`;
    isError.value = true;
  }
};
</script>
