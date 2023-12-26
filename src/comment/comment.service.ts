import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserAuthData } from '../auth/jwt.strategy';
import { PostRepository } from '../post/post.repository';
import { UserService } from '../user/user.service';

import { CommentResponseDto } from './comment.dto';
import { CommentRepository } from './comment.repository';

interface CreateCommentBody {
  text: string;
}

@Injectable()
export class CommentService {
  constructor(
    private userService: UserService,
    private postRepository: PostRepository,
    private commentRepository: CommentRepository,
  ) {}
  async getByPostId(
    user: UserAuthData,
    postId: number,
  ): Promise<CommentResponseDto[]> {
    const post = await this.postRepository.findOne({ id: postId });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!this.userService.isGroupMember(user, post.groupId)) {
      throw new HttpException(
        'You cannot read comments on posts in this group.',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.commentRepository.findAll({
      postId,
    });
  }

  async create(
    user: UserAuthData,
    postId: number,
    body: CreateCommentBody,
  ): Promise<CommentResponseDto> {
    const post = await this.postRepository.findOne({ id: postId });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!this.userService.isGroupMember(user, post.groupId)) {
      throw new HttpException(
        'You cannot create posts in this group',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.commentRepository.insertOne({
      createdBy: user.id,
      postId: postId,
      text: body.text,
    });
  }
}
