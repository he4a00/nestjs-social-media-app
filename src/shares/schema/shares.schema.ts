import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Shares {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Post' })
  post: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  author: string;
}

export const SharesSchema = SchemaFactory.createForClass(Shares);
SharesSchema.loadClass(Shares);
