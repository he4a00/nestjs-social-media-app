import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Likes, LikesSchema } from './schemas/likes.schema';
import { CommentSchema, Comments } from 'src/comments/schemas/comment.schema';
import { User, UserSchema } from 'src/users/schemas/users.schema';
import { Post, PostSchema } from 'src/posts/schemas/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Likes.name, schema: LikesSchema },
      { name: Comments.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [MongooseModule],
})
export class LikesModule {}
