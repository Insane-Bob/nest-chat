import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class SendMessageDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    @IsDateString()
    timestamp?: Date;

    @IsOptional()
    @IsBoolean()
    isRead?: boolean;

    @IsOptional()
    @IsBoolean()
    isDelivered?: boolean;
}
