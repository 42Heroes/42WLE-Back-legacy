import {
  Body,
  Controller,
  UseGuards,
  Delete,
  Get,
  Post,
  Put,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
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
  @UseGuards(JwtAuthGuard)
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser('id') id: string,
  ) {
    return this.boardService.createBoard(id, createBoardDto);
  }
  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteBoard(@Body() deleteBoardDto: DeleteBoardDto) {
    return this.boardService.deleteBoard(deleteBoardDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateBoard(@Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.updateBoard(updateBoardDto);
  }

  @Post('like')
  @UseGuards(JwtAuthGuard)
  async likeBoard(@GetUser('id') id: string, @Body('boardId') boardId: string) {
    return this.boardService.likeBoard(id, boardId);
  }
}
