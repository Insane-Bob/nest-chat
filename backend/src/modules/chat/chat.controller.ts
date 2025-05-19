import {Controller, Post, Body, UseGuards, Get, Request} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Chat } from '../../schemas/chat/chat.schema';

@Controller('chats')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createChat(@Body() createChatDto: CreateChatDto): Promise<Chat> {
        return this.chatService.createChat(createChatDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getChats(@Request() req): Promise<Chat[]> {
        return this.chatService.getChats(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':chatId')
    async getChatById(@Request() req): Promise<Chat> {
        return this.chatService.getChatById(req.params.chatId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':chatId')
    async getChatDetails(@Param('chatId') chatId: string): Promise<Chat> {
        return this.chatService.getChatDetails(chatId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':chatId')
    async deleteChat(@Request() req): Promise<Chat> {
        return this.chatService.deleteChat(req.params.chatId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':chatId/messages')
    async sendMessage(
        @Param('chatId') chatId: string,
        @Request() req,
        @Body() sendMessageDto: SendMessageDto
    ): Promise<Chat> {
        return this.chatService.sendMessages(chatId, req.user.userId, sendMessageDto);
    }
}
