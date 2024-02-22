import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';
import { Comments } from './schemas/comment.schema';
import { Post } from 'src/posts/schemas/post.schema';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name) private readonly commentModel: Model<Comments>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async addComment(
    commentDto: CommentDto,
    userId: string,
    id: string,
  ): Promise<object> {
    const user = await this.userModel.findById(userId);
    const post = await this.postModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const newComment = await this.commentModel.create({
      ...commentDto,
      author: user._id,
    });

    await this.postModel.findOneAndUpdate(
      {
        _id: post._id,
      },
      {
        $push: { comments: newComment._id },
      },
      {
        new: true,
      },
    );

    await newComment.save();
    return {
      status: 'success',
      newComment,
    };
  }

  async getCommentForPost(postId: string): Promise<object> {
    const psotComments = await this.postModel
      .findById(postId)
      .populate('comments')
      .populate('author', 'username email role')
      .exec();

    if (!psotComments) {
      throw new NotFoundException('No comments found for this post');
    }

    return {
      psotComments,
    };
  }

  async deleteComment(commentId: string): Promise<Comments> {
    const comment = await this.commentModel.findOneAndDelete({
      _id: commentId,
    });

    if (!comment) {
      throw new NotFoundException(`Could not find comment with this id`);
    }
    const post = await this.postModel.findOne({ comments: comment._id });

    await this.postModel.findOneAndUpdate(
      {
        _id: post._id,
      },
      {
        $pull: { comments: comment._id },
      },
    );

    return comment;
  }

  async updateComment(
    commentId: string,
    commentDto: CommentDto,
  ): Promise<Comments> {
    const comment = await this.commentModel.findOneAndUpdate(
      {
        _id: commentId,
      },
      { $set: { content: commentDto.content } },
      { new: true },
    );

    if (!comment) {
      throw new NotFoundException(`Could not find comment with this id`);
    }

    return comment;
  }
}
