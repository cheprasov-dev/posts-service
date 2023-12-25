import { Module } from '@nestjs/common';

import { CommentModule } from '../comment/comment.module';
import { PostModule } from '../post/post.module';

import { ApiController } from './api.controller';

@Module({
  imports: [CommentModule, PostModule],
  controllers: [ApiController],
})
export class ApiModule {}
