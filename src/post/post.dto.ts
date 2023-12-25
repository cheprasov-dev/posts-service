export class PostResponseDto {
  id: number;
  text: string;
  createdBy: number;
  commentsCount: number;
}

export class PostCommentResponseDto {
  id: number;
  text: string;
  createdBy: number;
}
