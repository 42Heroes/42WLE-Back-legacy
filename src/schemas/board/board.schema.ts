import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Comment } from '../comment/comment.schema';
import { User } from '../user/user.schema';

export type BoardDocument = Board & Document;
interface boardContents {
  text: string;
  img: string[];
}
@Schema()
export class Board {
  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  @Prop({
    required: true,
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
    ],
  })
  user: User;

  @Prop({
    required: true,
  })
  contents: boardContents;

  @Prop()
  likedUsers: string[];

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        autopopulate: true,
      },
    ],
  })
  comment: Comment;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
