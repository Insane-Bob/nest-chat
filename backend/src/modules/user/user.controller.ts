import { Body, Get, Put, Request, UseGuards, Controller } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt/jwt-auth.guard";
import { ProfileUserDto } from "../auth/dto/profile-user.dto";
import { UpdateUserDto } from "../auth/dto/update-user.dto";
import { UserService } from "./user.service";

class UpdateConnectionStatusDto {
    userId: string;
    connected: boolean;
}

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(): Promise<ProfileUserDto[]> {
        return this.userService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Put('status')
    async updateConnectionStatus(@Body() dto: UpdateConnectionStatusDto): Promise<void> {
        return this.userService.updateConnectionStatus(dto.userId, dto.connected);
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<UpdateUserDto> {
        return this.userService.updateProfile(req.user.userId, updateUserDto);
    }
}
