import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Comments extends Document {
  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  author: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comments);
CommentSchema.loadClass(Comments);
