import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UserAuthData } from '../auth/jwt.strategy';
import { UserService } from '../user/user.service';

import { PostResponseDto } from './post.dto';
import { PostRepository } from './post.repository';

export class CreatePostBody {
  groupId: number;
  text: string;
}

interface FilterValues {
  groupId: number;
}

@Injectable()
export class PostService {
  constructor(
    private userService: UserService,
    private postRepository: PostRepository,
  ) {}
  async create(
    user: UserAuthData,
    body: CreatePostBody,
  ): Promise<PostResponseDto> {
    if (!this.userService.isGroupMember(user, body.groupId)) {
      throw new HttpException(
        'You cannot create posts in this group',
        HttpStatus.FORBIDDEN,
      );
    }

    const insertResult = await this.postRepository.insertOne({
      text: body.text,
      userId: user.id,
      groupId: body.groupId,
    });

    return {
      ...insertResult,
      commentsCount: 0,
    };
  }

  async get(
    user: UserAuthData,
    filter: FilterValues,
  ): Promise<PostResponseDto[]> {
    if (!this.userService.isGroupMember(user, filter.groupId)) {
      throw new HttpException('This group is not available to you', 403);
    }

    return this.postRepository.findWithCommentCount(filter);
  }
}
