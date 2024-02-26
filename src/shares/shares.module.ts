import { Module } from '@nestjs/common';
import { SharesController } from './shares.controller';
import { SharesService } from './shares.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Shares, SharesSchema } from './schema/shares.schema';
import { User, UserSchema } from 'src/users/schemas/users.schema';
import { Post, PostSchema } from 'src/posts/schemas/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shares.name, schema: SharesSchema },
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [SharesController],
  providers: [SharesService],
  exports: [MongooseModule],
})
export class SharesModule {}
