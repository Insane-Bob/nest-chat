import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Message, MessageModel } from "../message/message.schema";
import {ChatVisibility} from '../../modules/chat/enums/chat-visibility.enum';

export type ChatModel = Chat & Document;

@Schema()
export class Chat {
    @Prop({ type: String, required: true })
    chatName: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    ownerId: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
    participants: Types.ObjectId[];

    @Prop({ type: [MessageModel], default: [] })
    messages: Message[];

    @Prop({ required: true, enum: ChatVisibility })
    visibility: ChatVisibility;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);