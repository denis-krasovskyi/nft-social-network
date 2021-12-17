import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    return this.commentRepository.create(createCommentDto);
  }

  async findAll() {
    return this.commentRepository.find();
  }

  async findOne(id: string) {
    return this.commentRepository.findOne(id);
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<UpdateResult> {
    return this.commentRepository.update(id, updateCommentDto);
  }

  async delete(id: string) {
    return this.commentRepository.delete(id);
  }
}
