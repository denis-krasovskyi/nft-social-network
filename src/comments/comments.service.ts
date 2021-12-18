import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResponse } from 'src/common/pagination.interface';
import { EventService } from 'src/event/event.service';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { MongoRepository, UpdateResult } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { PaginationCommentRequest } from './interfaces/pagination-comment-request.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: MongoRepository<Comment>,
    private readonly neo4jService: Neo4jService,
    private readonly eventService: EventService,
  ) {}

  async create(userId: string, createCommentDto: CreateCommentDto) {
    const comment = new Comment();
    comment.text = createCommentDto.text;
    comment.parentId = createCommentDto.parentId;
    comment.nftId = createCommentDto.nftId;
    comment.userId = userId;

    const createdComment = await this.commentRepository.save(comment);

    try {
      const result = await this.neo4jService.write(
        `CREATE p = (u:User {id: $userId})-[:COMMENTED]->(c:Comment {id: $commentId}) RETURN p`,
        { userId, commentId: createdComment.id },
      );
      console.log('result: ', result);
    } catch (err) {
      console.error(err);
    }

    this.eventService.emit('create-comment', createdComment);

    return createdComment;
  }

  async findAll({
    userId,
    nftId,
    offset,
    limit,
  }: PaginationCommentRequest): Promise<PaginationResponse<Comment>> {
    const data = await this.commentRepository
      .aggregate([
        { $addFields: { userObjectId: { $toObjectId: '$userId' } } },
        {
          $lookup: {
            from: 'user',
            localField: 'userObjectId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $match: { userId, nftId } },
      ])
      .skip(Number(offset))
      .limit(Number(limit))
      .toArray();

    const total = await this.commentRepository.count({ userId, nftId });

    return {
      offset,
      limit,
      total,
      data,
    };
  }

  findOne(id: string) {
    return this.commentRepository.findOne(id);
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<UpdateResult> {
    const updatedComment = await this.commentRepository.update(
      id,
      updateCommentDto,
    );

    this.eventService.emit('update-comment', updatedComment);

    return updatedComment;
  }

  async delete(id: string) {
    return this.commentRepository.delete(id);
  }
}
