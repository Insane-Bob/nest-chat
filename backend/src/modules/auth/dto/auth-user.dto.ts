import { IsString, IsNotEmpty, IsOptional, Matches, MinLength } from 'class-validator';

export class AuthUserDto {
    @IsString()
    @IsNotEmpty({ message: 'Username is required' })
    username: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;

    @IsOptional()
    @IsString()
    @Matches(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, { message: 'Color must be a valid hex code' })
    color?: string;

    @IsOptional()
    @IsString()
    @Matches(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i, { message: 'Avatar must be a valid URL' })
    avatar?: string;
}