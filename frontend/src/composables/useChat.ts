import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { io, Socket } from 'socket.io-client'

interface Message {
    messageId: string
    sender: {
        _id: string
        username: string
    }
    content: string
    timestamp: string | Date
}

interface Chat {
    messages: Message[]
}

interface SendMessagePayload {
    chatId: string
    userId: string
    content: string
}

export function useChat(chatId: string, onNewMessage?: (message: Message) => void) {
    const messages = ref<Message[]>([])
    const message = ref<string>('')
    const socket = ref<Socket | null>(null)

    watch(() => chatId, (newChatId, oldChatId) => {
        if (socket.value && oldChatId) {
            socket.value.emit('leaveChat', oldChatId)
            socket.value.emit('joinChat', newChatId)
            messages.value = []
        }
    })

    onMounted(() => {
        const newSocket = io('http://localhost:3000', {
            transports: ['websocket'],
            withCredentials: true,
        })
        socket.value = newSocket

        newSocket.emit('joinChat', chatId)

        newSocket.on('receiveMessage', (newChat: Chat) => {
            console.log("RECEIVED MESSAGES:", newChat.messages)

            messages.value = newChat.messages

            if (onNewMessage && newChat.messages.length > 0) {
                const newMsg = newChat.messages[newChat.messages.length - 1]
                onNewMessage(newMsg)
            }
        })
    })

    onBeforeUnmount(() => {
        if (socket.value) {
            socket.value.emit('leaveChat', chatId)
            socket.value.disconnect()
        }
    })

    function sendMessage(userId: string, content: string) {
        if (!socket.value) return
        const payload: SendMessagePayload = { chatId, userId, content }
        console.log("MESSAGE SENT", payload)

        socket.value.emit('sendMessage', payload)
        message.value = ''
    }

    return {
        messages,
        message,
        sendMessage,
    }
}
