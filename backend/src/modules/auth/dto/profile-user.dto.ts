import { IsNotEmpty, IsString } from 'class-validator';

export class ProfileUserDto {
    @IsString()
    @IsNotEmpty({ message: 'Username is required' })
    username: string;

    @IsString()
    @IsNotEmpty({ message: 'Color is required' })
    color: string;

    @IsString()
    @IsNotEmpty({ message: 'Avatar is required' })
    avatar: string;

    @IsString()
    @IsNotEmpty({ message: 'Connected status is required' })
    connected: boolean;
}