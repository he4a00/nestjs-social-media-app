import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Comments } from 'src/comments/schemas/comment.schema';
import { Likes } from 'src/likes/schemas/likes.schema';

@Schema()
export class Post extends Document {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  author: string;

  @Prop({ type: Types.ObjectId, ref: 'Comments' })
  comments: Comments[];

  @Prop({ type: Types.ObjectId, ref: 'Likes' })
  likes: Likes[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.loadClass(Post);
