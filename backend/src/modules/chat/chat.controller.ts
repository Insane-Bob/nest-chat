import {Controller, Post, Body, UseGuards, Get, Request, Param, Delete, Put, NotFoundException} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Chat } from '../../schemas/chat/chat.schema';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chats')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createChatDto: CreateChatDto, @Request() req) {
        return this.chatService.createChat(createChatDto, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getChats(@Request() req): Promise<Chat[]> {
        return this.chatService.getChats(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':chatId')
    async getChatDetails(@Param('chatId') chatId: string, @Request() req): Promise<Chat> {
        return this.chatService.getChatDetails(chatId, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':chatId')
    async deleteChat(@Param('chatId') chatId: string): Promise<Chat> {
        console.log('DELETE request received for chatId:', chatId);
        return this.chatService.deleteChat(chatId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':chatId/messages')
    async sendMessage(@Param('chatId') chatId: string, @Request() req, @Body() sendMessageDto: SendMessageDto): Promise<Chat> {
        return this.chatService.sendMessage(chatId, req.user.userId, sendMessageDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':chatId/mark-as-read')
    async markAsRead(@Param('chatId') chatId: string, @Request() req): Promise<Chat> {
        return this.chatService.markAsRead(chatId, req.user.userId);
    }
}
