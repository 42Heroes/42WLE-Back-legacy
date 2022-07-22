import { IsString } from 'class-validator';
export class CommentUpdateDto {
  @IsString()
  boardId: string;

  @IsString()
  content: string;

  @IsString()
  commentId: string;
}
