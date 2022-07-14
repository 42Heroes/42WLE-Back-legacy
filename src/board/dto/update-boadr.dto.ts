import { IsObject, IsString } from 'class-validator';
import { boardContents } from 'src/interface/board/boardContent.interface';
export class UpdateBoardDto {
  @IsString()
  boardId: string;

  @IsObject()
  contents: boardContents;
}
