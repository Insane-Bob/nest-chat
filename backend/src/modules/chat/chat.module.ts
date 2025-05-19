import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat, ChatSchema } from '../../schemas/chat/chat.schema';
import { User, UserSchema } from '../../schemas/user/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [ChatService],
    controllers: [ChatController],
})
export class ChatModule {}