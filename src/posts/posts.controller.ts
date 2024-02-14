import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGurad } from 'src/auth/guards/jwt.guard';
import { PostDto } from './dto/post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create-post')
  @UseGuards(JwtAuthGurad)
  createPost(@Body() postDto: PostDto, @Request() req) {
    return this.postsService.createPost(postDto, req.user?._id);
  }

  @Get(':authorId')
  getPostsByAuthor(@Param('authorId') authorId: string) {
    return this.postsService.getPostsByAuthor(authorId);
  }

  @Get()
  getAllPosts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.postsService.getAllPosts(page, limit);
  }

  @Delete(`:id`)
  @UseGuards(JwtAuthGurad)
  deletePost(@Param('id') id: string, @Request() req) {
    const userId = req.user._id;
    return this.postsService.deletePost(id, userId);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGurad)
  updatePost(@Body() updatePostDto: PostDto, @Param('id') id: string) {
    return this.postsService.updatePost(id);
  }
}
