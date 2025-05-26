import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import {Chat, ChatModel} from '../../schemas/chat/chat.schema';
import {CreateChatDto} from './dto/create-chat.dto';
import {SendMessageDto} from "./dto/send-message.dto";
import { Message } from "../../schemas/message/message.schema";
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private chatModel: Model<ChatModel>) {
    }

    async createChat(createChatDto: CreateChatDto, userId: string): Promise<Chat> {
        const participants = Array.from(new Set([
            userId,
            ...(createChatDto.participants || []),
        ]));

        const newChat = new this.chatModel({
            chatName: createChatDto.chatName,
            ownerId: userId,
            participants,
            visibility: createChatDto.visibility,
            messages: [],
        });

        console.log(newChat);

        return newChat.save();
    }

    async getChats(userId: string): Promise<Chat[]> {
        return this.chatModel.find({participants: userId}).populate('participants', 'username').exec();
    }

    async getChatDetails(chatId: string): Promise<Chat> {
        const chat = await this.chatModel.findById(chatId)
            .populate('participants', 'username avatar color _id')
            .populate('messages.sender', 'username avatar color _id')
            .exec();

        if (!chat) {
            throw new NotFoundException('Chat not found');
        }

        return chat;
    }

    async deleteChat(chatId: string): Promise<Chat> {
        const chat = await this.chatModel.findById(chatId);
        if (!chat) {
            throw new Error('Chat not found');
        }
        await this.chatModel.deleteOne(
            {_id: chatId}
        )

        return chat;
    }

    async sendMessage(chatId: string, userId: string, sendMessageDto: SendMessageDto): Promise<Chat> {
        const chat = await this.chatModel.findById(chatId);
        if (!chat) {
            throw new NotFoundException('Chat not found');
        }

        const message: Message = {
            messageId: uuidv4(),
            sender: new Types.ObjectId(userId),
            content: sendMessageDto.content,
            timestamp: sendMessageDto.timestamp || new Date(),
            isDelivered: sendMessageDto.isDelivered ?? false,
            isRead: sendMessageDto.isRead ?? false,
            isEdited: false,
            isDeleted: false,
            status: [],
        };

        chat.messages.push(message);

        await chat.save();

        const populatedChat = await this.chatModel.findById(chatId)
            .populate('participants', 'username avatar color _id')
            .populate('messages.sender', 'username avatar color _id')
            .exec();

        if (!populatedChat) {
            throw new NotFoundException('Chat not found after update');
        }

        return populatedChat;
    }
}