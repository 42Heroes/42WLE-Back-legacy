import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Board, BoardSchema } from 'src/schemas/board/board.schema';
import { Comment, CommentSchema } from 'src/schemas/comment/comment.schema';
import { UserModule } from 'src/user/user.module';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Board.name, schema: BoardSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
