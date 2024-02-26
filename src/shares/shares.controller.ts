import { Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { SharesService } from './shares.service';
import { JwtAuthGurad } from 'src/auth/guards/jwt.guard';

@Controller('shares')
export class SharesController {
  constructor(private readonly sharesService: SharesService) {}
  @Post(':postId')
  @UseGuards(JwtAuthGurad)
  sharePost(@Param('postId') postId: string, @Request() req) {
    return this.sharesService.sharePost(req.user._id, postId);
  }
}
