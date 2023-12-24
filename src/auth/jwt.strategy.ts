import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface Payload {
  id: number;
  userGroups: number[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    const JWT_SECRET = configService.get('JWT_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: Payload) {
    // TODO here a call to the service will be implemented to check that the user exists.
    // TODO You can also add checks that the user is not blocked or deleted
    const user = {};
    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: payload.id, userGroups: payload.userGroups };
  }
}
