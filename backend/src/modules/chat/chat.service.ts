import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatModel } from '../../schemas/chat/chat.schema';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private chatModel: Model<ChatModel>) {}

    async createChat(createChatDto: CreateChatDto): Promise<Chat> {
        const newChat = new this.chatModel({
            participants: createChatDto.participants,
            messages: [],
        });
        return newChat.save();
    }
}