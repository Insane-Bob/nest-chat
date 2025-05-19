import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {AuthModule} from './modules/auth/auth.module';
import {User, UserSchema} from './schemas/user/user.schema';
import {UserModule} from "./modules/user/user.module";

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://mongodb:27017/nest'),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        AuthModule,
        UserModule,
    ],
})
export class AppModule {
}