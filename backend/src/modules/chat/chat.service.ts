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

    /**
     * Creates a new chat with the given details.
     *
     * @param createChatDto
     * @param userId
     *
     * @return {Promise<Chat>}
     */
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

        return newChat.save();
    }

    /**
     * Retrieves all chats for a given user.
     *
     * @param userId
     * @return {Promise<Chat[]>}
     */
    async getChats(userId: string): Promise<Chat[]> {
        return this.chatModel.find({participants: userId}).populate('participants', 'username').exec();
    }

    /**
     * Retrieves the details of a chat by its ID.
     *
     * @param chatId
     * @param userId
     *
     * @return {Promise<Chat>}
     */
    async getChatDetails(chatId: string, userId: string): Promise<Chat> {
        await this.markAsRead(chatId, userId);

        const chat = await this.chatModel.findById(chatId)
            .populate('participants', 'username avatar color _id')
            .populate('messages.sender', 'username avatar color _id')
            .exec();

        if (!chat) {
            throw new NotFoundException('Chat not found');
        }

        return chat;
    }


    /**
     * Deletes a chat by its ID.
     *
     * @param chatId
     *
     * @return {Promise<Chat>}
     */
    async deleteChat(chatId: string): Promise<Chat> {
        const deletedChat = await this.chatModel.findByIdAndDelete(chatId);
        if (!deletedChat) {
            throw new NotFoundException(`Chat with id ${chatId} not found`);
        }
        return deletedChat;
    }

    /**
     * Sends a message in a chat.
     *
     * @param chatId
     * @param userId
     * @param sendMessageDto
     *
     * @return {Promise<Chat>}
     */
    async sendMessage(chatId: string, userId: string, sendMessageDto: SendMessageDto): Promise<Chat> {
        const chat = await this.chatModel.findById(chatId);
        if (!chat) {
            throw new NotFoundException('Chat not found');
        }

        const userObjectId = new Types.ObjectId(userId);

        const message: Message = {
            messageId: uuidv4(),
            sender: userObjectId,
            content: sendMessageDto.content,
            timestamp: sendMessageDto.timestamp || new Date(),
            isDelivered: sendMessageDto.isDelivered ?? false,
            isRead: sendMessageDto.isRead ?? false,
            isEdited: false,
            isDeleted: false,
            status: [],
            readBy: [userObjectId],
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

    async markAsRead(chatId: string, userId: string): Promise<Chat> {
        const chat = await this.chatModel.findById(chatId);
        if (!chat) {
            throw new NotFoundException('Chat not found');
        }

        const userObjectId = new Types.ObjectId(userId);
        let updated = false;

        chat.messages.forEach(message => {
            // Si userId n'est pas dans readBy, on l'ajoute
            if (!message.readBy.some(id => id.equals(userObjectId))) {
                message.readBy.push(userObjectId);
                updated = true;
            }
        });

        if (updated) {
            await chat.save();
        }

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