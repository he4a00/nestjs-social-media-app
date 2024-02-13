import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
}
