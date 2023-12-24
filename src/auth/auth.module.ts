import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const JWT_SECRET = configService.get('JWT_SECRET');
        return {
          secret: JWT_SECRET,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
