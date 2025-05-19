import { IsString, IsOptional, IsNotEmpty, Matches } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'Username is required' })
    username?: string;

    @IsString()
    @IsOptional()
    color?: string;

    // @IsString()
    // @IsOptional()
    // @Matches(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i, { message: 'Avatar must be a valid URL' })
    // avatar?: string;
}