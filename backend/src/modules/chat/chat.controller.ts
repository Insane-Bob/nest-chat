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
    async getChats(@Request() request): Promise<Chat[]> {
        return this.chatService.getChats(request.user._id,);
    }
}
