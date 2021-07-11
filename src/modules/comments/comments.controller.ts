import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCommentDto } from './comments.dto';
import { CommentService } from './comments.service';
import { ApiImplicitBody, ApiImplicitParam } from '@nestjs/swagger';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /** Create a comment in database with this endpoint */
  @Post()
  @ApiImplicitBody({ name: 'CreateCommentDto', type: CreateCommentDto })
  async createComment(@Body() dto: CreateCommentDto) {
    return await this.commentService.createComment(dto);
  }

  @Get(':commentId')
  @ApiImplicitParam({ name: 'commentId', required: true, type: Number })
  async getComment(@Param('commentId') commentId: number) {
    return await this.commentService.getComment(commentId);
  }
}
