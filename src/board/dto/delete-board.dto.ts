import { IsString } from 'class-validator';

export class DeleteBoardDto {
  @IsString()
  userId: string;

  @IsString()
  boardId: string;
}
