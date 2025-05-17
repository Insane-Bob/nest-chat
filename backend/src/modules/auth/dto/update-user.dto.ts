import { IsString, IsOptional, IsNotEmpty, Matches } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'Username is required' })
    username?: string;

    @IsString()
    @IsOptional()
    @Matches(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, { message: 'Color must be a valid hex code' })
    color?: string;

    @IsString()
    @IsOptional()
    @Matches(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i, { message: 'Avatar must be a valid URL' })
    avatar?: string;
}