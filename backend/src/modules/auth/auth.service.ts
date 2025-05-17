import { Injectable } from '@nestjs/common';
import {AuthUserDto} from "./dto/auth-user.dto";
import {ProfileUserDto} from "./dto/profile-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class AuthService {
    constructor(@InjectModel(User) private userModel: Model<UserDocument>) {}

    /**
     * Register a new user
     *
     * @param registerUserDto
     *
     * @returns {Promise<User>}
     */
    async register(registerUserDto: AuthUserDto): Promise<User> {
        const { username, password } = registerUserDto;

        const existingUser = await this.userModel.findOne({ username }).exec();
        if (!existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        // Create the new user
        const newUser = new this.userModel({
            username,
            password: hashedPassword,
            color: '#000000', // DEFAULT COLOR
            avatar: '',
        });
    }

    /**
     * Validate user credentials
     *
     * @param username
     * @param password
     *
     * @returns {Promise<any>}
     */
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({ username }).exec();
        if (!user) {
            return null;
        }

        return user;
    }

    /**
     * Login user
     *
     * @param loginUserDto
     *
     * @returns {Promise<any>}
     */
    async login(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
        const { username, password } = loginUserDto;
        const user = await this.validateUser(username, password);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const payload = { username: user.username, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    /**
     * Profile of the user
     *
     * @param userId
     *
     * @returns {Promise<User>}
     */
    async profile(userId: string): Promise<ProfileUserDto> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new Error('User not found');
        }

        return {username: user.username, color: user.color, avatar: user.avatar};
    }

    /**
     * Update user profile
     *
     * @param userId
     *
     * @returns {Promise<UpdateUserDto>}
     */
    async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new Error('User not found');
        }

        if (updateUserDto.username) {
            user.username = updateUserDto.username;
        }

        if (updateUserDto.color) {
            user.color = updateUserDto.color;
        }

        if (updateUserDto.avatar) {
            user.avatar = updateUserDto.avatar;
        }

        await user.save();
    }
}
