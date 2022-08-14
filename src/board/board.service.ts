import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from 'src/schemas/board/board.schema';
import { Comment } from 'src/schemas/comment/comment.schema';
import { UserService } from 'src/user/user.service';
import { CommentCreateDto } from './dto/comment-create.dto';
import { CommentUpdateDto } from './dto/comment-update.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-boadr.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<Board>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    readonly userService: UserService,
  ) {}

  async createBoard(
    userId: string,
    createBoardDto: CreateBoardDto,
  ): Promise<boolean> {
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
    return this.boardModel.find().sort({ updatedAt: -1 });
  }

  async deleteBoard(userId: string, boardId: string): Promise<boolean> {
    try {
      await (
        await this.userService.getOneUser(userId)
      ).updateOne({ $pull: { board: boardId } });
      await this.commentModel.deleteMany({ board: boardId });
      await this.boardModel.findByIdAndDelete(boardId);
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
      const [user, board] = await Promise.all([
        this.userService.getOneUser(userId),
        this.boardModel.findById(boardId),
      ]);
      const isExist = board.likes.findIndex((like) => like.id === user.id);
      if (isExist === -1) {
        board.likes.push(user.id);
      } else {
        board.likes.splice(isExist, 1);
      }
      await Promise.all([user.save(), board.save()]);
      return board.likes;
    } catch (error) {
      throw new HttpException(error, 501);
    }
  }
  async createBoardComment(userId: string, commentCreateDto: CommentCreateDto) {
    try {
      const author = await this.userService.getOneUser(userId);
      const board = await this.boardModel.findById(commentCreateDto.boardId);
      const comment = new this.commentModel({
        author,
        content: commentCreateDto.content,
        board,
      });
      board.comments.push(comment);
      await board.save();
      await comment.save();
      return board.comments;
    } catch (error) {
      throw new HttpException(error, 501);
    }
  }

  async likeBoardComment(userId: string, commentId: string) {
    try {
      const user = await this.userService.getOneUser(userId);
      const comment = await this.commentModel.findById(commentId);
      const isExist = comment.likes.indexOf(user.nickname);
      if (isExist === -1) {
        comment.likes.push(user.nickname);
      } else {
        comment.likes.splice(isExist, 1);
      }
      await user.save();
      await comment.save();
      return comment.likes;
    } catch (error) {
      throw new HttpException(error, 501);
    }
  }

  async deleteBoardComment(userId: string, commentId: string, boardId: string) {
    try {
      const comment = await this.commentModel.findById(commentId);
      if (comment.author.id !== userId) {
        throw new HttpException('삭제 권한이 없습니다.', 401);
      }
      const board = await this.boardModel.findById(boardId);
      const isNestedCommentExist = comment.comments.length > 0 ? true : false;
      if (isNestedCommentExist) {
        comment.isDeleted = true;
        comment.content = 'This comment is deleted';
        await comment.save();
      } else {
        board.comments = board.comments.filter(
          (comment) => comment.id !== commentId,
        );
        await this.commentModel.findByIdAndDelete(commentId);
        await board.save();
      }
      return board.comments;
    } catch (error) {
      throw new HttpException(error, 501);
    }
  }

  async updateBoardComment(userId: string, commentUpdateDto: CommentUpdateDto) {
    try {
      const comment = await this.commentModel.findById(
        commentUpdateDto.commentId,
      );
      if (comment.author.id !== userId) {
        throw new HttpException('수정 권한이 없습니다.', 401);
      }
      comment.content = commentUpdateDto.content;
      comment.updatedAt = new Date();
      await comment.save();
    } catch (error) {
      throw new HttpException(error, 501);
    }
  }
}
