import { Repository } from 'typeorm';
import { getDataSource } from '../../../../shared/infra/database/typeorm';
import { Comment as CommentEntity } from '../../../../shared/infra/database/typeorm/entities/Comment';
import { ICommentRepo } from "../commentRepo";
import { Comment } from "../../domain/comment";
import { CommentDetails } from "../../domain/commentDetails";
import { CommentMap } from "../../mappers/commentMap";
import { CommentId } from "../../domain/commentId";
import { CommentDetailsMap } from "../../mappers/commentDetailsMap";
import { ICommentVotesRepo } from "../commentVotesRepo";
import { CommentVotes } from "../../domain/commentVotes";
import { MemberId } from "../../domain/memberId";

export class CommentRepo implements ICommentRepo {
  private repository: Repository<CommentEntity>;
  private commentVotesRepo: ICommentVotesRepo;

  constructor(commentVotesRepo: ICommentVotesRepo) {
    this.repository = getDataSource().getRepository(CommentEntity);
    this.commentVotesRepo = commentVotesRepo;
  }

  async exists(commentId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { comment_id: commentId }
    });
    return count > 0;
  }

  async getCommentDetailsByPostSlug(slug: string, memberId?: MemberId, offset?: number): Promise<CommentDetails[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.post', 'post')
      .innerJoinAndSelect('comment.member', 'member')
      .innerJoinAndSelect('member.baseUser', 'baseUser')
      .where('post.slug = :slug', { slug })
      .skip(offset || 0)
      .take(15);

    if (memberId) {
      queryBuilder.leftJoinAndSelect(
        'comment.votes',
        'commentVotes',
        'commentVotes.member_id = :memberId',
        { memberId: memberId.getStringValue() }
      );
    }

    const comments = await queryBuilder.getMany();
    return comments.map((c) => CommentDetailsMap.toDomain(c));
  }

  async getCommentByCommentId(commentId: string): Promise<Comment> {
    const comment = await this.repository.findOne({
      where: { comment_id: commentId }
    });

    if (!comment) throw new Error('Comment not found');
    return CommentMap.toDomain(comment);
  }

  async getCommentDetailsByCommentId(commentId: string, memberId?: MemberId): Promise<CommentDetails> {
    const queryBuilder = this.repository
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.post', 'post')
      .innerJoinAndSelect('comment.member', 'member')
      .innerJoinAndSelect('member.baseUser', 'baseUser')
      .where('comment.comment_id = :commentId', { commentId });

    if (memberId) {
      queryBuilder.leftJoinAndSelect(
        'comment.votes',
        'commentVotes',
        'commentVotes.member_id = :memberId',
        { memberId: memberId.getStringValue() }
      );
    }

    const comment = await queryBuilder.getOne();

    if (!comment) throw new Error('Comment not found');
    return CommentDetailsMap.toDomain(comment);
  }

  async deleteComment(commentId: CommentId): Promise<void> {
    await this.repository.delete({ comment_id: commentId.getStringValue() });
  }

  private saveCommentVotes(commentVotes: CommentVotes) {
    return this.commentVotesRepo.saveBulk(commentVotes);
  }

  async save(comment: Comment): Promise<void> {
    const exists = await this.exists(comment.commentId.getStringValue());
    const rawComment = CommentMap.toPersistence(comment);

    if (!exists) {
      try {
        await this.repository.save(rawComment);
        await this.saveCommentVotes(comment.getVotes());
      } catch (err) {
        throw new Error(err.toString());
      }
    } else {
      await this.saveCommentVotes(comment.getVotes());
      await this.repository.save(rawComment);
    }
  }

  async saveBulk(comments: Comment[]): Promise<void> {
    for (let comment of comments) {
      await this.save(comment);
    }
  }
}
