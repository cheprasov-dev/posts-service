import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNumber()
  groupId: number;

  @IsString()
  @IsNotEmpty()
  text: string;
}

export class CreatePostCommentDto {
  @IsNumber()
  postId: number;

  @IsString()
  @IsNotEmpty()
  text: string;
}
