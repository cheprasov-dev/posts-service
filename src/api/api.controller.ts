import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserAuthData } from '../auth/jwt.strategy';
import { User } from '../auth/user.decorator';
import { CommentResponseDto } from '../comment/comment.dto';
import { CommentService } from '../comment/comment.service';
import { PostResponseDto } from '../post/post.dto';
import { PostService } from '../post/post.service';

import { CreateCommentDto, CreatePostDto } from './api.dto';

@Controller('api/:version')
export class ApiController {
  constructor(
    private commentService: CommentService,
    private postService: PostService,
  ) {}

  @Get('/posts')
  @ApiOperation({ summary: 'Get posts' })
  @ApiResponse({
    status: 200,
    description: 'The found post records',
    type: [PostResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 401, description: 'User is not authorized' })
  @ApiResponse({ status: 403, description: 'Access is denied' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getPosts(@User() user: UserAuthData): Promise<PostResponseDto[]> {
    return this.postService.create(user);
  }

  @Post('/posts')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({
    status: 201,
    description: 'Post created',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 401, description: 'User is not authorized' })
  @ApiResponse({ status: 403, description: 'Access is denied' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createPost(
    @User() user: UserAuthData,
    @Body() body: CreatePostDto,
  ): Promise<PostResponseDto> {
    return this.postService.create(user, body);
  }

  @Get('/posts/:id/comments')
  @ApiOperation({ summary: "Get post's comments" })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The post ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "The found post's comment records",
    type: [PostCommentResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 401, description: 'User is not authorized' })
  @ApiResponse({ status: 403, description: 'Access is denied' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getPostComments(
    @User() user: UserAuthData,
    @Param('id') postId: number,
  ): Promise<PostCommentResponseDto[]> {
    return this.commentService.getByPostId(user, postId);
  }

  @Post('/posts/:id/comments')
  @ApiOperation({ summary: "Create post's comment" })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The post ID',
    type: String,
  })
  @ApiResponse({
    status: 201,
    description: 'Comment created',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 401, description: 'User is not authorized' })
  @ApiResponse({ status: 403, description: 'Access is denied' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createComment(
    @User() user: UserAuthData,
    @Param('id') postId: number,
    @Body() body: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentService.create(user, postId, body);
  }
}
