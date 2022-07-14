import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from 'src/schemas/board/board.schema';
import { UserService } from 'src/user/user.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { DeleteBoardDto } from './dto/delete-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<Board>,
    readonly userService: UserService,
  ) {}

  async createBoard(createBoardDto: CreateBoardDto): Promise<boolean> {
    const user = await await this.userService.getOneUser(createBoardDto.userId);
    try {
      const board = new this.boardModel({
        user,
        contents: createBoardDto.contents,
      });
      user.board.push(board);
      console.log(user.board);
      await user.save();
      await board.save();
      return true;
    } catch (error) {
      throw new HttpException(error, 501);
      // return false;
    }
  }

  async findAllBoard(): Promise<Board[]> {
    return this.boardModel.find().exec();
  }

  async deleteBoard(deleteBoardDto: DeleteBoardDto) {
    const user = await this.userService.getOneUser(deleteBoardDto.userId);
    const board = await this.boardModel.findByIdAndDelete(
      deleteBoardDto.boardid,
    );
    // user.board.for

    return true;
  }
}
