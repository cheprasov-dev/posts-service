import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { Comment } from '../comment/comment.model';
import { Post } from '../post/post.model';

@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const HOST = configService.get('PG_HOST');
        const PORT = configService.get<number>('PG_PORT');
        const USERNAME = configService.get('PG_USERNAME');
        const PASSWORD = configService.get('PG_PASSWORD');
        const DATABASE = configService.get('PG_DATABASE');

        return {
          dialect: 'postgres',
          host: HOST,
          port: PORT,
          username: USERNAME,
          password: PASSWORD,
          database: DATABASE,
          models: [Post, Comment],
          autoLoadModels: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
