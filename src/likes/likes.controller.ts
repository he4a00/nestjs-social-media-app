import { Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGurad } from 'src/auth/guards/jwt.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':postId')
  @UseGuards(JwtAuthGurad)
  toggleLike(@Param('postId') postId: string, @Request() req) {
    return this.likesService.toggleLike(postId, req.user._id);
  }
}
