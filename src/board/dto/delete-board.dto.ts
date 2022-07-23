import { IsString } from 'class-validator';

export class DeleteBoardDto {
  @IsString()
  boardId: string;
}
