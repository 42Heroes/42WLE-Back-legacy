import { IsString } from 'class-validator';
export class CommentBoardDto {
  @IsString()
  boardId: string;

  @IsString()
  content: string;
}
