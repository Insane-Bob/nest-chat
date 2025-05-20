<template>
  <div class="flex h-screen w-screen overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-muted border-r p-4 hidden md:block">
      <Navigation />
    </aside>

    <!-- Main content area -->
    <div class="flex flex-col flex-1">
      <header class="flex justify-between h-16 border-b bg-background items-center px-6">
        <h1 class="text-lg font-semibold">Chat App</h1>
        <!-- Profile -->
        <ProfileDropdown />
      </header>

      <!-- Toast Notifications -->
      <Toaster />

      <!-- Router View (Main) -->
      <main class="flex-1 overflow-y-auto bg-muted/50 p-4">
        <div class="flex justify-center">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Navigation from "@/components/navigation/Navigation.vue";
import ProfileDropdown from "@/components/profile/ProfileDropdown.vue";
import { Toaster } from '@/components/ui/sonner'
</script>
