import { IsArray, IsMongoId, ArrayNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import {ChatVisibility} from '../enums/chat-visibility.enum';

export class CreateChatDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsMongoId({ each: true })
    participants: string[];

    @IsMongoId()
    ownerId: string;

    @IsString()
    chatName: string;

    @IsEnum(ChatVisibility)
    @IsOptional()
    visibility?: ChatVisibility;
}