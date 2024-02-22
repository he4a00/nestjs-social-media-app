import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGurad } from 'src/auth/guards/jwt.guard';
import { CommentDto } from './dto/comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post(':id/add-comment')
  @UseGuards(JwtAuthGurad)
  addComment(
    @Body() commentDto: CommentDto,
    @Request() req,
    @Param('id')
    id: string,
  ) {
    return this.commentService.addComment(commentDto, req.user._id, id);
  }

  @Get(':postId')
  getCommentsForPost(@Param('postId') postId: string) {
    return this.commentService.getCommentForPost(postId);
  }

  @Delete('delete/:commentId')
  @UseGuards(JwtAuthGurad)
  deleteComment(@Param('commentId') commentId: string) {
    return this.commentService.deleteComment(commentId);
  }

  @Patch('update/:commentId')
  @UseGuards(JwtAuthGurad)
  updateComment(
    @Param('commentId') commentId: string,
    @Body() commentDto: CommentDto,
  ) {
    return this.commentService.updateComment(commentId, commentDto);
  }
}
