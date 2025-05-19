import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserModel = User & Document;

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: '#000000' })
    color: string;

    @Prop({ default: '' })
    avatar: string;

    @Prop({ default: false })
    connected: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
