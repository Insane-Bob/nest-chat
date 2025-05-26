import { IsArray, IsMongoId, ArrayNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import {ChatVisibility} from '../enums/chat-visibility.enum';

export class CreateChatDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsMongoId({ each: true })
    participants: string[];

    @IsString()
    chatName: string;

    @IsEnum(ChatVisibility)
    visibility: ChatVisibility;
}