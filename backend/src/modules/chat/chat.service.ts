import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatModel } from '../../schemas/chat/chat.schema';
import { CreateChatDto } from './dto/create-chat.dto';
import {SendMessageDto} from "./dto/send-message.dto";

@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private chatModel: Model<ChatModel>) {}

    async createChat(createChatDto: CreateChatDto): Promise<Chat> {
        const newChat = new this.chatModel({
            chatName: createChatDto.chatName,
            participants: createChatDto.participants,
            messages: [],
        });
        return newChat.save();
    }

    async getChats(userId: string): Promise<Chat[]> {
        return this.chatModel.find({ participants: userId }).populate('participants', 'username').exec();
    }

    async getChatDetails(chatId: string): Promise<Chat> {
        const chat = await this.chatModel.find({ _id: chatId }).populate('participants', 'username').exec();
    }

    async deleteChat(chatId: string): Promise<Chat> {
        const chat = await this.chatModel.findById(chatId);
        if (!chat) {
            throw new Error('Chat not found');
        }
        await this.chatModel.deleteOne(
            { _id: chatId }
        )

        return chat;
    }

    async sendMessages(chatId: string, userId: string, sendMessageDto: SendMessageDto): Promise<Chat> {
        const chat = await this.chatModel.findById(chatId);
        if (!chat) {
            throw new NotFoundException('Chat not found');
        }

        chat.messages.push({
            sender: userId,
            content: sendMessageDto.content,
            timestamp: new Date(),
        });

        return chat.save();
    }
}