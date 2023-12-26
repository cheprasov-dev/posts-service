import { Type } from 'class-transformer';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNumber()
  groupId: number;

  @IsString()
  @IsNotEmpty()
  text: string;
}

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class QueryGetPostsDto {
  @Type(() => Number)
  @IsNumber()
  groupId: number;
}
