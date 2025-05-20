<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink @click="goToChat" as="button" class="hover:cursor-pointer">
            <h2 class="text-lg font-semibold">All Chats</h2>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>

<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {RouterLink} from 'vue-router'
import {useUserStore} from '@/stores/useUserStore'
import {useRouter} from 'vue-router'
import {useToast} from '@/composables/useToastStore'

const userStore = useUserStore()
const router = useRouter()
const {showToast} = useToast();

function goToChat() {
  if (!userStore.isLoggedIn) {
    showToast('Please log in to access the chat.', 'error')
    router.push('/login')
  } else {
    router.push('/chats')
  }
}
</script>
