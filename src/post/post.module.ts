import { Module } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { UserModule } from '../user/user.module';

import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  imports: [UserModule],
  providers: [PostService, DatabaseService, PostRepository],
  exports: [PostService, PostRepository],
})
export class PostModule {}
