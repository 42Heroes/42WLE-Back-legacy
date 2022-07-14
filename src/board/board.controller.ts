import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from 'src/schemas/board/board.schema';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { DeleteBoardDto } from './dto/delete-board.dto';
import { UpdateBoardDto } from './dto/update-boadr.dto';

@Controller('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    @InjectModel(Board.name) private boardModel: Model<Board>,
  ) {}
  @Get()
  async findAll(): Promise<Board[]> {
    return this.boardService.findAllBoard();
  }

  @Post()
  async createBoard(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.createBoard(createBoardDto);
  }
  @Delete()
  async deleteBoard(@Body() deleteBoardDto: DeleteBoardDto) {
    return this.boardService.deleteBoard(deleteBoardDto);
  }

  @Put()
  async updateBoard(@Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.updateBoard(updateBoardDto);
  }
}
