import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Likes } from './schemas/likes.schema';
import { Model } from 'mongoose';
import { Comments } from 'src/comments/schemas/comment.schema';
import { Post } from 'src/posts/schemas/post.schema';
import { User } from 'src/users/schemas/users.schema';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Likes.name) private readonly likesModel: Model<Likes>,
    @InjectModel(Comments.name) private readonly commentModel: Model<Comments>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async toggleLike(postId: string, userId: string): Promise<string> {
    const user = await this.userModel.findOne({ _id: userId });
    const post = await this.postModel.findOne({ _id: postId });
    let newLike;
    const isAlreadyLiked = await this.likesModel.findOne({
      author: user._id,
      post: postId,
    });

    if (isAlreadyLiked) {
      await this.likesModel.findByIdAndDelete(isAlreadyLiked._id);
      await this.postModel.findOneAndUpdate(
        {
          _id: post._id,
        },
        {
          $pull: { likes: isAlreadyLiked._id }, // Changed newLike._id to isAlreadyLiked._id
        },
      );
      return 'Like removed from the post';
    } else {
      newLike = await this.likesModel.create({
        post: postId,
        author: user._id,
      });
    }

    if (newLike) {
      // Added a check to ensure newLike is defined
      await this.postModel.findOneAndUpdate(
        {
          _id: post._id,
        },
        {
          $push: { likes: newLike._id },
        },
        {
          new: true,
        },
      );
      return 'Like added to the post';
    } else {
      return 'Error in adding like to the post';
    }
  }
}
