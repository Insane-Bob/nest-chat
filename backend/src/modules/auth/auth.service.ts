import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor() {
        @InjectModel(User)
        private readonly userModel: Model<UserDocument>,
    }
}
