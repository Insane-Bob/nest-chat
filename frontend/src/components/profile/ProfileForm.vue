<template>
  <div class="flex justify-center items-center h-screen">
    <Card class="w-96">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your avatar, username and favorite color
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-6">

          <!-- Avatar preview + file input -->
          <div class="flex flex-col items-center">
            <Avatar
                class="w-24 h-24 rounded-full object-cover mb-2"
            >
              <AvatarImage :src="avatarPreview" alt="@unovue"/>
              <AvatarFallback>
                {{ username }}
              </AvatarFallback>
            </Avatar>
            <Input type="file" accept="image/*" @change="onFileChange"/>
          </div>

          <!-- Username -->
          <div>
            <Input
                id="username"
                v-model="username"
                type="text"
                placeholder="Your username"
                class="w-full"
                required
            />
          </div>

          <!-- Color -->
          <div>
            <label for="color" class="block mb-1 font-medium text-sm">Choose your color</label>
            <input
                id="color"
                v-model="color"
                type="color"
                class="w-full h-10 p-1 rounded"
            />
          </div>

          <!-- Submit -->
          <Button type="submit" class="w-full bg-blue-600 hover:bg-blue-700">
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useUserStore} from '@/stores/useUserStore'
import {useAuthGuard} from '@/composables/useAuthGuard'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {updateProfile} from '@/services/userService'
import {useToast} from "@/composables/useToastStore.js";

const {showToast} = useToast();
useAuthGuard()

// Importing necessary components and services for the Auth
const userStore = useUserStore()
userStore.hydrateFromLocalStorage()

const username = ref(userStore.user?.username ?? '')
const color = ref(userStore.user?.color ?? '#000000')
const avatarPreview = ref(userStore.user?.avatar ?? '')
const avatarFile = ref<File | null>(null)

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    avatarFile.value = file

    const reader = new FileReader()
    reader.onload = () => {
      avatarPreview.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

async function handleSubmit() {
  try {
    const token = userStore.token;
    if (!token) throw new Error('Missing token');

    const updateUserDto = {
      username: username.value,
      color: color.value,
      avatar: avatarPreview.value,
    };

    const updatedUser = await updateProfile(token, updateUserDto);
    userStore.setUser(updatedUser);

    showToast('Profile updated successfully!', 'success')

  } catch (error) {
    console.error('Error updating profile:', error)
    showToast('Failed to update profile. Please try again.', 'error')
  }
}
</script>
