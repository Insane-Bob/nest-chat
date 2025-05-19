import {Controller, Post, Body, UseGuards, Get, Put, Request, UnauthorizedException} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthUserDto} from './dto/auth-user.dto';
import {User} from '../../schemas/user/user.schema';
import {LoginUserDto} from "./dto/login-user.dto";
import {JwtAuthGuard} from "./jwt/jwt-auth.guard";
import {ProfileUserDto} from "./dto/profile-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    /**
     * Register a user
     *
     * @param registerUserDto
     *
     * @returns {Promise<User>}
     */
    @Post('register')
    async register(@Body() registerUserDto: AuthUserDto): Promise<User> {
        return this.authService.register(registerUserDto);
    }

    /**
     * Login a user
     *
     * @param loginUserDto
     *
     * @returns {Promise<User>}
     */
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
        return this.authService.login(loginUserDto);
    }
}