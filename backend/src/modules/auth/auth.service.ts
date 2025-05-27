import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User, UserModel} from '../../schemas/user/user.schema';
import * as bcrypt from 'bcrypt';
import {AuthUserDto} from "./dto/auth-user.dto";
import {LoginUserDto} from "./dto/login-user.dto";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserModel>,
        private readonly jwtService: JwtService,
    ) {
    }

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
            connected: false,
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
    async login(loginUserDto: LoginUserDto): Promise<{ access_token: string, user: any }> {
        const { username, password } = loginUserDto;
        const user = await this.validateUser(username, password);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const payload = {
            username: user.username,
            identifier: user._id,
        };

        const userObj = user.toObject();

        delete userObj.password;

        return {
            access_token: this.jwtService.sign(payload),
            user: userObj,
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
        const user = await this.userModel.findOne({username}).exec();
        if (!user) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }
}
