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
    isDelivered: boolean
    isRead: boolean
}

export function useChat(chatId: string, onNewMessage?: (message: Message) => void) {
    const messages = ref<Message[]>([])
    const message = ref<string>('')
    const socket = ref<Socket | null>(null)
    const typingUsers = ref(new Set());

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

        newSocket.on('receiveMessage', (newMessage: Message) => {
            messages.value.push(newMessage);

            if (onNewMessage) {
                onNewMessage(newMessage);
            }
        });

        newSocket.on('userTyping', ({ userId }) => {
            typingUsers.value.add(userId);
            setTimeout(() => typingUsers.value.delete(userId), 5000);
        });
    })

    onBeforeUnmount(() => {
        if (socket.value) {
            socket.value.emit('leaveChat', chatId)
            socket.value.disconnect()
        }
    })

    function sendMessage(userId: string, content: string) {
        if (!socket.value) return
        if (!content.trim()) return;

        const payload: SendMessagePayload = {
            chatId,
            userId,
            content,
            isDelivered: true,
            isRead: false,
        }

        console.log("SENDING MESSAGE:", content)

        socket.value.emit('sendMessage', payload)
        message.value = ''
        typingUsers.value.clear();
    }

    function notifyTyping(chatId: string, userId: string) {
        if (!socket.value) return;
        socket.value.emit('typing', { chatId, userId });
    }

    return {
        messages,
        message,
        sendMessage,
        notifyTyping,
        typingUsers,
    }
}
