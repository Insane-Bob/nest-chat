    import { Injectable } from '@nestjs/common';
    import { InjectModel } from '@nestjs/mongoose';
    import { Model } from 'mongoose';
    import { User, UserModel } from '../../schemas/user/user.schema';
    import { ProfileUserDto } from '../auth/dto/profile-user.dto';
    import { UpdateUserDto } from '../auth/dto/update-user.dto';

    @Injectable()
    export class UserService {
        constructor(@InjectModel(User.name) private userModel: Model<UserModel>) {}

        /**
         * Find all users
         *
         * @returns {Promise<ProfileUserDto[]>}
         */
        async findAll(): Promise<ProfileUserDto[]> {
            const users = await this.userModel.find().exec();
            return users.map((user) => ({
                username: user.username,
                color: user.color,
                avatar: user.avatar,
                connected: user.connected,
            }));
        }

        /**
         * Update user connection status
         *
         * @param userId
         * @param updateUserDto
         * @returns {Promise<void>}
         */
        async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<UpdateUserDto> {
            const user = await this.userModel.findById(userId).exec();
            if (!user) {
                throw new Error('User not found');
            }
            if (updateUserDto.username) user.username = updateUserDto.username;
            if (updateUserDto.color) user.color = updateUserDto.color;
            // if (updateUserDto.avatar) user.avatar = updateUserDto.avatar;

            await user.save();

            return {
                username: user.username,
                color: user.color,
            };
        }

        /**
         * Update user connection status
         *
         * @param userId
         * @param connected
         * @returns {Promise<void>}
         */
        async updateConnectionStatus(userId: string, connected: boolean): Promise<void> {
            const user = await this.userModel
                .findById(userId)
                .exec();
            if (!user) {
                throw new Error('User not found');
            }
            user.connected = connected;
            await user.save();
        }
    }
