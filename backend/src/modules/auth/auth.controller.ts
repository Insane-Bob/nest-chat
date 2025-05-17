import {Controller, Post, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthUserDto} from "./dto/auth-user.dto";
import {ProfileUserDto} from "./dto/profile-user.dto";

@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService) {}

    /**
     * Register a new user
     *
     * @param registerUserDto
     */
    @Post('register')
    async register(
        @Body() registerUserDto: AuthUserDto
    ): Promise<User> {
        // Register the new user
        return this.authService.register(registerUserDto);
    }

    /**
     * Login user
     *
     * @param loginUserDto
     */
    @Post('login')
    async login(
        @Body() loginUserDto: AuthUserDto
    ): Promise<{ access_token: string }> {
        // Login the user and return the JWT token
        return this.authService.login(loginUserDto);
    }

    /**
     * Get user profile
     *
     * @param request
     */
    @UseGuards(JwtAuthGuard())
    @Get('profile')
    async profile(@Request() request): Promise<{ username: string }> {
        return this.authService.getUserProfile(request.user.userId);
    }

    /**
     * Update user profile
     *
     * @param request
     * @param updateUserDto
     */
    @UseGuards(JwtAuthGuard())
    @Put('profile')
    async updateProfile(
        @Request() request,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<ProfileUserDto> {
        return this.authService.updateUserProfile(request.user.userId, updateUserDto);
    }
}
