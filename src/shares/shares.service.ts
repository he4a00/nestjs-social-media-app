import { Injectable, NotFoundException } from '@nestjs/common';
import { Shares } from './schema/shares.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/posts/schemas/post.schema';
import { User } from 'src/users/schemas/users.schema';

@Injectable()
export class SharesService {
  constructor(
    @InjectModel(Shares.name) private readonly sharesModel: Model<Shares>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async sharePost(userId: string, postId: string): Promise<Shares> {
    const user = await this.userModel.findOne({ _id: userId });
    const post = await this.postModel.findOne({ _id: postId });

    if (!user) {
      throw new NotFoundException('no user found');
    }
    if (!post) {
      throw new NotFoundException('no post found');
    }

    const sharedPost = await this.sharesModel.create({
      author: user._id,
      post: postId,
    });

    return sharedPost;
  }
}
