import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User, UserDocument } from 'src/schemas/user/user.schema';
import { Board } from '../board/board.schema';

export type CommentDocument = Comment & mongoose.Document;

@Schema()
export class Comment {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true,
  })
  author: UserDocument;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  @Prop({ required: true })
  content: string;

  @Prop([String])
  likes: string[];

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        autopopulate: true,
      },
    ],
  })
  comments: Comment[];

  @Prop({ required: true, default: false })
  isDeleted: boolean;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
  })
  board: Board;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
