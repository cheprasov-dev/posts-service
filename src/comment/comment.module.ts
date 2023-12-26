import { Module } from '@nestjs/common';

import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

@Module({
  imports: [UserModule, PostModule],
  providers: [CommentService, CommentRepository, UserService],
  exports: [CommentService],
})
export class CommentModule {}
