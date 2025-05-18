<template>
  <div class="flex justify-center items-center h-screen">
    <Card class="w-96">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <Input
                id="username"
                v-model="username"
                type="text"
                placeholder="ex: cool_dev42"
                class="w-full"
            />
          </div>

          <div class="mb-4">
            <Input
                id="password"
                v-model="password"
                type="password"
                variant="password"
                placeholder="ex: ••••••••"
                class="w-full"
            />
          </div>

          <div class="flex justify-center">
            <Button type="submit" class="w-full bg-blue-600 hover:bg-blue-700">
              Login
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <p class="text-center text-sm text-gray-500">
          Don't have an account?
          <router-link to="/register" class="text-blue-600">Register</router-link>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/services/authService.js";

const router = useRouter();

const username = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    await login(username.value, password.value);
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message;
  }
};
</script>
