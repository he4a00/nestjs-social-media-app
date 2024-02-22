import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Likes {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Post' })
  post: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  author: string;
}

export const LikesSchema = SchemaFactory.createForClass(Likes);
LikesSchema.loadClass(Likes);
