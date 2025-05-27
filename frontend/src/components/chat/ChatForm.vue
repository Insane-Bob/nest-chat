<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger as-child>

      <Button :style="{ backgroundColor: userColor }" class="w-full"
        :class="{ 'bg-blue-500 hover:bg-blue-600': userColor === '#000000' }"
      >
        <Plus class="w-4 h-4 mr-2" /> Create a new chat
      </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Create Chat</DialogTitle>
        <DialogDescription>
          Choose a chat name and select participants
        </DialogDescription>
      </DialogHeader>

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

          <Select v-model="visibility" id="visibility" class="w-full">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select visibility"/>
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

        <DialogFooter>
          <Button type="submit" class="w-full" :style="{ backgroundColor: userColor }"
          >
            Create Chat
          </Button>
        </DialogFooter>

        <p
            v-if="message"
            :class="{
              'text-green-600': !isError,
              'text-red-600': isError,
            }"
            class="text-center text-sm mt-4"
        >
          {{ message }}
        </p>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {findAllUsers} from '@/services/userService';
import {createChat} from '@/services/chatService';
import {useRouter} from 'vue-router';
import {useToast} from '@/composables/useToastStore';
import {ChatVisibility} from '@/types/chat-visibility.enum';
import {useUserStore} from '@/stores/useUserStore';
import {Plus} from 'lucide-vue-next';

interface User {
  _id: string;
  username: string;
  connected?: boolean;
}

const router = useRouter();
const user = useUserStore();
const {showToast} = useToast();

const isDialogOpen = ref(false);
const chatName = ref('');
const selectedParticipantId = ref('');
const visibility = ref<ChatVisibility>('');
const allUsers = ref<User[]>([]);
const message = ref('');
const isError = ref(false);
const userColor = user.user?.color ?? '#000000';

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

    isError.value = false;
    chatName.value = '';
    selectedParticipantId.value = '';
    showToast('Chat created successfully', 'success');
    isDialogOpen.value = false;
    location.reload();
  } catch (err: any) {
    message.value = `Error: ${err.message || 'Unknown error'}`;
    isError.value = true;
  }
};
</script>