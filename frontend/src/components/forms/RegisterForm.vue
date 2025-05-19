<template>
  <div class="flex justify-center items-center h-screen">
    <Card class="w-96">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Choose your username, password and color</CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleRegister">
          <div class="mb-4">
            <Label for="username" class="block mb-1">Username</Label>
            <Input
                id="username"
                v-model="username"
                type="text"
                placeholder="ex: cool_dev42"
                class="w-full"
            />
          </div>

          <div class="mb-4">
            <Label for="password" class="block mb-1">Password</Label>
            <Input
                id="password"
                v-model="password"
                type="password"
                variant="password"
                placeholder="ex: ••••••••"
                class="w-full"
            />
          </div>

          <div class="mb-4">
            <Label for="color" class="block mb-1">Choose your color</Label>
            <Input
                id="color"
                v-model="color"
                type="color"
                class="w-full h-10 p-1 rounded"
            />
          </div>

          <div class="flex justify-center">
            <Button type="submit" class="w-full bg-green-600 hover:bg-green-700">
              Register
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <p class="text-center text-sm text-gray-500">
          Already have an account?
          <router-link to="/login" class="text-blue-600">Login</router-link>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {Button} from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Label} from "@/components/ui/label/index.js";
import { register } from '@/services/authService'
import { useToast } from "@/composables/useToastStore.js";

const { showToast } = useToast();
const router = useRouter()

const username = ref('')
const password = ref('')
const color = ref('#000000')

const handleRegister = async () => {
    try {
        const response = await register(username.value, password.value, color.value)
        if (response.status === 201) {
            router.push('/login')
            showToast('Registration successful! Please login.', 'success')
        } else {
            showToast('Registration failed. Please try again.', 'error')
        }
    } catch (error) {
        console.error('Registration error:', error)
        showToast('An error occurred during registration. Please try again.', 'error')
    }
}
</script>
