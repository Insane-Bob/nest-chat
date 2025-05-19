import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from './jwt.payload';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secret',
        });
    }

    /**
     * Validate the JWT payload
     *
     * @param payload
     *
     * @returns {Promise<{ userId: string, username: string }>}
     */
    async validate(payload: JwtPayload) {
        return { userId: payload.identifier, username: payload.username };
    }
}