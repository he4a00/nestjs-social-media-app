import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { PostDto } from './dto/post.dto';
import { User } from 'src/users/schemas/users.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createPost(postDto: PostDto, userId: string): Promise<object> {
    const user = await this.userModel.findById(userId); // Find the user by ID
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newPost = await this.postModel.create({
      ...postDto,
      author: user._id,
    });

    await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { posts: newPost._id } }, // Add post ID to user's posts array
      { new: true, useFindAndModify: false },
    );
    await newPost.save();
    return {
      status: 'success',
      newPost,
    };
  }

  async getPostsByAuthor(author: string): Promise<Post[]> {
    const posts = await this.postModel
      .find({ author })
      .populate('author', 'username email role')
      .exec();

    if (!posts || posts.length === 0) {
      throw new NotFoundException('No posts found for this author');
    }

    return posts;
  }
}
