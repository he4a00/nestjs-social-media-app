import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { PostDto } from './dto/post.dto';
import { User } from 'src/users/schemas/users.schema';
import { PaginationService } from 'src/utils/pagination';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly paginationService: PaginationService,
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
      { $push: { posts: newPost._id } },
      { new: true },
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

  async getAllPosts(page: number, limit: number) {
    const {
      pagination,
      skip,
      limit: actualLimit,
    } = await this.paginationService.paginate(this.postModel, { page, limit });

    const posts = await this.postModel.find().skip(skip).limit(actualLimit);

    if (!posts || posts.length === 0) {
      throw new NotFoundException('No posts found');
    }

    return {
      posts,
      pagination,
    };
  }

  async deletePost(id: string, userId: string): Promise<Post> {
    const post = await this.postModel.findOneAndDelete({ _id: id });
    if (!post) {
      throw new NotFoundException(`Could not find post with this id`);
    }

    await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { posts: post._id },
      },
    );

    return post;
  }

  async updatePost(id: string) {
    const post = await this.postModel.findOneAndUpdate(
      {
        _id: id,
      },
      { new: true },
    );
    if (!post) {
      throw new NotFoundException(`Could not find post with this id`);
    }

    return post;
  }
}
