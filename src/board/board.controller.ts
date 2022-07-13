import { Body, Controller, Get, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from 'src/schemas/board/board.schema';
import { BoardService } from './board.service';
import { BoardDto } from './dto/create-board.dto';

@Controller('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    @InjectModel(Board.name) private boardModel: Model<Board>,
  ) {}

  @Post('create')
  async createBoard(@Body() boardDto: BoardDto) {
    this.createBoard(boardDto);
  }
}
