import { IsObject, IsString } from 'class-validator';
import { boardContents } from 'src/interface/board/boardContent.interface';
export class CreateBoardDto {
  @IsString()
  userId: string;

  @IsObject()
  contents: boardContents;
}
