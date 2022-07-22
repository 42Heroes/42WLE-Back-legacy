import { IsString } from 'class-validator';
export class CommentCreateDto {
  @IsString()
  boardId: string;

  @IsString()
  content: string;
}
