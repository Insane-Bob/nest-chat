import { IsArray, IsString, ArrayMinSize } from 'class-validator';

export class CreateChatDto {
    @IsArray()
    @IsString({ each: true })
    participants: string[];
}