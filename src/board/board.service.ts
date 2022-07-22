import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from 'src/schemas/board/board.schema';
import { UserService } from 'src/user/user.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { DeleteBoardDto } from './dto/delete-board.dto';
import { UpdateBoardDto } from './dto/update-boadr.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<Board>,
    readonly userService: UserService,
  ) {}

  async createBoard(
    userId: string,
    createBoardDto: CreateBoardDto,
  ): Promise<boolean> {
    //TODO: jwt token 이용해서 userId 가져오기
    const author = await this.userService.getOneUser(userId);
    try {
      const board = new this.boardModel({
        author,
        contents: createBoardDto.contents,
      });
      author.board.push(board);
      await author.save();
      await board.save();
      return true;
    } catch (error) {
      throw new HttpException(error, 501);
    }
  }

  async findAllBoard(): Promise<Board[]> {
    return this.boardModel.find().exec();
  }

  async deleteBoard(deleteBoardDto: DeleteBoardDto): Promise<boolean> {
    try {
      const author = await (
        await this.userService.getOneUser(deleteBoardDto.userId)
      ).update({ $pull: { board: deleteBoardDto.boardId } });
      await this.boardModel.findByIdAndDelete(deleteBoardDto.boardId);
      await author.save();
      return true;
    } catch (error) {
      throw new HttpException(error, 501);
    }
  }

  async updateBoard(updateBoardDto: UpdateBoardDto) {
    try {
      await this.boardModel.findByIdAndUpdate(
        { _id: updateBoardDto.boardId },
        { contents: updateBoardDto.contents },
      );
      return true;
    } catch (error) {
      throw new HttpException(error, 501);
    }
  }

  async likeBoard(userId: string, boardId: string): Promise<any> {
    try {
      const user = await this.userService.getOneUser(userId);
      const board = await this.boardModel.findById(boardId);
      const isExist = board.likedUsers.indexOf(user.nickname);
      if (isExist === -1) {
        board.likedUsers.push(user.nickname);
      } else {
        board.likedUsers.splice(isExist, 1);
      }
      await user.save();
      await board.save();
      return board.likedUsers;
    } catch (error) {
      throw new HttpException(error, 501);
    }
  }
}
