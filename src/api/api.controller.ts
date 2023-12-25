import { Controller, Get, Post } from '@nestjs/common';

@Controller('api/:version')
export class ApiController {
  @Post('/posts')
  getPosts() {}

  @Get('/posts')
  createPost() {}

  @Post('/posts/:id/comments')
  getPostComments() {}

  @Get('/posts/:id/comments')
  createComment() {}
}
