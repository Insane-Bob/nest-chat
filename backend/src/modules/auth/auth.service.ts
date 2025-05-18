import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User, UserModel} from '../../schemas/user/user.schema';
import * as bcrypt from 'bcrypt';
import {AuthUserDto} from "./dto/auth-user.dto";
import {LoginUserDto} from "./dto/login-user.dto";
import {JwtService} from "@nestjs/jwt";
import {ProfileUserDto} from "./dto/profile-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserModel>,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * Register a new user
     *
     * @param registerUserDto
     *
     * @returns {Promise<User>}
     */
    async register(registerUserDto: AuthUserDto): Promise<User> {
        const {username, password} = registerUserDto;

        // Check if the user already exists
        const existingUser = await this.userModel.findOne({username}).exec();
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash the password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // Add the color and avatar properties
        const color = registerUserDto.color || '#000000';
        const avatar = registerUserDto.avatar || '';

        // Create a new user
        const newUser = new this.userModel({
            username: username,
            password: hashedPassword,
            color: color,
            avatar: avatar,
        });
        return newUser.save();
    }

    /**
     * Login a user
     *
     *
     * @returns {Promise<User | null>}
     * @param loginUserDto
     */
    async login(loginUserDto: LoginUserDto): Promise<{ access_token: string, user: UserModel }> {
        const { username, password } = loginUserDto;
        const user = await this.validateUser(username, password);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const payload = {
            username: user.username,
            identifier: user._id,
        };
        // Remove the password from the user object before returning it
        const { password: _, ...userWithoutPassword } = user.toObject();

        return {
            access_token: this.jwtService.sign(payload),
            user: userWithoutPassword,
        };
    }

    /**
     * Validate user credentials
     *
     * @param username
     * @param password
     *
     * @returns {Promise<any>}
     */
    async validateUser(username: string, password: string): Promise<UserModel | null> {
        const user = await this.userModel.findOne({ username }).exec();
        if (!user) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }

    /**
     * Get use by ID to display in the profile
     *
     * @param id
     *
     * @returns {Promise<User>}
     */
    async getUserById(id: string): Promise<ProfileUserDto> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new Error('User not found');
        }

        return {
            username: user.username,
        }
    }

    /**
     * Update the profile of the user
     *
     *
     * @returns {Promise<User>}
     * @param userId
     * @param updateUserDto
     */
    async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userModel.findById(userId).exec();
        console.log(user);
        if(!user) {
            throw new Error('User not found');
        }

        // Update the user properties
        if (updateUserDto.username) user.username = updateUserDto.username;
        if (updateUserDto.color) user.color = updateUserDto.color;

        // Save the updated user
        return user.save();
    }
}
