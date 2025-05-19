import { IsArray, IsMongoId, ArrayNotEmpty } from 'class-validator';

export class CreateChatDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsMongoId({ each: true })
    participants: string[];

    chatName: string;
}