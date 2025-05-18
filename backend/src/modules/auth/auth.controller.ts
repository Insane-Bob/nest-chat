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

    /**
     * Get the user profile
     *
     * @param userId
     *
     * @returns {Promise<ProfileUserDto>}
     */
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getUserById(@Body('userId') userId: string): Promise<ProfileUserDto> {
        return this.authService.getUserById(userId);
    }

    /**
     * Update the user profile
     *
     *
     * @returns {Promise<User>}
     * @param req
     * @param updateUserDto
     */
    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        console.log('Update profile called, user:', req.user);
        return this.authService.updateUser(req.user.userId, updateUserDto);
    }

    @Get('test')
    test() {
        console.log('Route test hit');
        return 'Test OK';
    }
}