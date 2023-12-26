import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { DatabaseModule } from './database/database.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ApiModule,
    AuthModule,
    PostModule,
    CommentModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env.local', '.env.development', '.env'],
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        PG_HOST: Joi.string().required(),
        PG_PORT: Joi.number().required(),
        PG_USERNAME: Joi.string().required(),
        PG_PASSWORD: Joi.string().required(),
        PG_DATABASE: Joi.string().required(),
      }),
    }),
    UserModule,
  ],
})
export class AppModule {}
