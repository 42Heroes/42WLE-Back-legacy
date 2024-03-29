import {
  Body,
  Controller,
  UseGuards,
  Delete,
  Get,
  Post,
  Put,
  Patch,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { Board } from 'src/schemas/board/board.schema';
import { BoardService } from './board.service';
import { CommentCreateDto } from './dto/comment-create.dto';
import { CommentUpdateDto } from './dto/comment-update.dto';
import { CreateBoardDto } from './dto/create-board.dto';
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
  async deleteBoard(
    @GetUser('id') id: string,
    @Body('boardId') boardId: string,
  ) {
    console.log(boardId);
    return this.boardService.deleteBoard(id, boardId);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateBoard(@Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.updateBoard(updateBoardDto);
  }

  @Post('like')
  @UseGuards(JwtAuthGuard)
  async likeBoard(@GetUser('id') id: string, @Body('boardId') boardId: string) {
    console.log(boardId);
    return this.boardService.likeBoard(id, boardId);
  }

  @Post('comment')
  @UseGuards(JwtAuthGuard)
  async createBoardComment(
    @GetUser('id') id: string,
    @Body() commentCreateDto: CommentCreateDto,
  ) {
    return this.boardService.createBoardComment(id, commentCreateDto);
  }

  @Post('comment/like')
  @UseGuards(JwtAuthGuard)
  async likeBoardComment(
    @GetUser('id') userId: string,
    @Body('commentId') commentId: string,
  ) {
    return this.boardService.likeBoardComment(userId, commentId);
  }

  @Delete('comment')
  @UseGuards(JwtAuthGuard)
  async deleteBoardComment(
    @GetUser('id') id: string,
    @Body('commentId') commentId: string,
    @Body('boardId') boardId: string,
  ) {
    return this.boardService.deleteBoardComment(id, commentId, boardId);
  }

  @Patch('comment')
  @UseGuards(JwtAuthGuard)
  async updateBoardComment(
    @GetUser('id') id: string,
    @Body() commentUpdateDto: CommentUpdateDto,
  ) {
    this.boardService.updateBoardComment(id, commentUpdateDto);
  }
}
