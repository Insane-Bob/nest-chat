import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService} from "../../modules/chat/chat.service";
import { SendMessageDto } from '../../modules/chat/dto/send-message.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private readonly chatService: ChatService) {}

    afterInit(server: Server) {
        console.log('Init');
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(client: Socket, payload: { chatId: string; userId: string; content: string }) {
        const messageDto: SendMessageDto = { content: payload.content, isDelivered: true, isRead: false };
        const chat = await this.chatService.sendMessage(payload.chatId, payload.userId, messageDto);

        const newMessage = chat.messages[chat.messages.length - 1];

        this.server.to(payload.chatId).emit('receiveMessage', newMessage);
    }

    @SubscribeMessage('joinChat')
    handleJoinChat(client: Socket, chatId: string) {
        client.join(chatId);
        await this.chatService.markAsRead(chatId, userId);
        console.log(`Client ${client.id} joined chat ${chatId}`);
    }

    @SubscribeMessage('typing')
    handleTyping(client: Socket, payload: { chatId: string; userId: string }) {
        client.to(payload.chatId).emit('userTyping', {userId: payload.userId});
        console.log(`User ${payload.userId} is typing in chat ${payload.chatId}`);
    }
}