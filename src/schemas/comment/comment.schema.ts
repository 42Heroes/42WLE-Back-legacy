import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User, UserDocument } from 'src/schemas/user/user.schema';

export type CommentDocument = Comment & mongoose.Document;

@Schema()
export class Comment {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  @Prop({ required: true })
  content: string;

  @Prop({
    type: Array,
  })
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
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
