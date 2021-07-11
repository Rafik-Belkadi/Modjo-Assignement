import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './comments.dto';
import { Comment } from './comments.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createComment(dto: CreateCommentDto) {
    return await this.commentRepository.save(dto);
  }

  async getComment(id: number) {
    return await this.commentRepository.findOne(id, {
      relations: ['call'],
    });
  }
}
