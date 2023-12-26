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
