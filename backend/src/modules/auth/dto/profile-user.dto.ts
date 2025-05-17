import { IsNotEmpty, IsString } from 'class-validator';

export class ProfileUserDto {
    @IsString()
    @IsNotEmpty({ message: 'Username is required' })
    username: string;
}