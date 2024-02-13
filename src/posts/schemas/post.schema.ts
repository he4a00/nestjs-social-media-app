import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// import { User } from 'src/users/schemas/users.schema';

@Schema()
export class Post extends Document {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  author: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.loadClass(Post);
