import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Board, BoardSchema } from 'src/schemas/board/board.schema';
import { Comment, CommentSchema } from 'src/schemas/comment/comment.schema';
import { UserModule } from 'src/user/user.module';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Board.name,
        useFactory: () => {
          const schema = BoardSchema;
          schema.plugin(require('mongoose-autopopulate'));
          return schema;
        },
      },
      {
        name: Comment.name,
        useFactory: () => {
          const schema = CommentSchema;
          schema.plugin(require('mongoose-autopopulate'));
          return schema;
        },
      },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
