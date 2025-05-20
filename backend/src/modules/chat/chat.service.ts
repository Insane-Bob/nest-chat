import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import {Chat, ChatModel} from '../../schemas/chat/chat.schema';
import {CreateChatDto} from './dto/create-chat.dto';
import {SendMessageDto} from "./dto/send-message.dto";

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
            visibility: createChatDto.visibility || 'PRIVATE',
            messages: [],
        });

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

        console.log('CHAT FETCHED FROM MONGO');

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

        const message = {
            messageId: new Types.ObjectId().toHexString(),
            sender: new Types.ObjectId(userId),
            content: sendMessageDto.content,
            timestamp: sendMessageDto.timestamp || new Date(),
            isRead: sendMessageDto.isRead || false,
            isDelivered: sendMessageDto.isDelivered || false,
            isEdited: sendMessageDto.isEdited || false,
            isDeleted: sendMessageDto.isDeleted || false,
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