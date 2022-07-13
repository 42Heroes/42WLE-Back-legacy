import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from 'src/schemas/board/board.schema';
import { BoardController } from './board.controller';
import { BoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<Board>,
    readonly boardController: BoardController,
  ) {}

  async createBoard(my_id: string, boardDto: BoardDto): Promise<Board> {
    const newBoard = new this.boardModel({
      my_id,
      boardDto,
    });
    return newBoard.save();
  }

  async findAll(): Promise<Board[]> {
    return this.boardModel.find().exec();
  }

  async deletBoard(my_id: string): Promise<boolean> {
    return true;
  }
}
