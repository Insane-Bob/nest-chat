import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Message {
    @Prop({ type: String, required: true })
    messageId: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    sender: Types.ObjectId;

    @Prop({ type: String, required: true })
    content: string;

    @Prop({ type: Date, default: Date.now })
    timestamp: Date;

    @Prop({ type: Boolean, default: false })
    isDelivered: boolean;

    @Prop({ type: Boolean, default: false })
    isRead: boolean;

    @Prop({ type: Boolean, default: false })
    isEdited: boolean;

    @Prop({ type: Boolean, default: false })
    isDeleted: boolean;

    @Prop({
        type: [
            {
                user: { type: Types.ObjectId, ref: 'User', required: true },
                deliveredAt: { type: Date, default: null },
                seenAt: { type: Date, default: null }
            }
        ],
        default: []
    })
    status: {
        user: Types.ObjectId;
        deliveredAt?: Date;
        seenAt?: Date;
    }[];
}

export const MessageModel = SchemaFactory.createForClass(Message);
