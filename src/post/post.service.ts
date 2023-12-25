import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UserAuthData } from '../auth/jwt.strategy';

import { PostResponseDto } from './post.dto';
import { PostRepository } from './post.repository';

export class CreatePostBody {
  groupId: number;
  text: string;
}

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}
  async create(
    user: UserAuthData,
    body: CreatePostBody,
  ): Promise<PostResponseDto> {
    if (!user.userGroups.includes(body.groupId)) {
      throw new HttpException(
        'You cannot create posts in this group',
        HttpStatus.FORBIDDEN,
      );
    }
    const insertResult = await this.postRepository.insertOne({
      groupId: body.groupId,
      text: body.text,
      id: user.id,
    });

    return {
      ...insertResult,
      commentsCount: 0,
    };
  }
  async get() {}
}
