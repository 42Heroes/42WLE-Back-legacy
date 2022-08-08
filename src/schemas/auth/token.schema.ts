import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../user/user.schema';

export type RefreshTokenDocument = RefreshToken & mongoose.Document;

@Schema()
export class RefreshToken {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: String, default: null })
  refreshToken: string;
}

export const TokenSchema = SchemaFactory.createForClass(RefreshToken);
