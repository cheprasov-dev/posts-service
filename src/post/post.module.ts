import { Module } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  providers: [PostService, DatabaseService, PostRepository],
  exports: [PostService],
})
export class PostModule {}
