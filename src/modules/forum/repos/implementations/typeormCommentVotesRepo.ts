import { Repository } from 'typeorm';
import { getDataSource } from '../../../../shared/infra/database/typeorm';
import { CommentVote as CommentVoteEntity } from '../../../../shared/infra/database/typeorm/entities/CommentVote';
import { ICommentVotesRepo } from "../commentVotesRepo";
import { CommentVote } from "../../domain/commentVote";
import { MemberId } from "../../domain/memberId";
import { CommentId } from "../../domain/commentId";
import { CommentVoteMap } from "../../mappers/commentVoteMap";
import { CommentVotes } from "../../domain/commentVotes";
import { VoteType } from "../../domain/vote";
import { PostId } from "../../domain/postId";

export class CommentVotesRepo implements ICommentVotesRepo {
  private repository: Repository<CommentVoteEntity>;

  constructor() {
    this.repository = getDataSource().getRepository(CommentVoteEntity);
  }

  async exists(commentId: CommentId, memberId: MemberId, voteType: VoteType): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        comment_id: commentId.getStringValue(),
        member_id: memberId.getStringValue(),
        type: voteType
      }
    });
    return count > 0;
  }

  async saveBulk(votes: CommentVotes): Promise<any> {
    for (let vote of votes.getRemovedItems()) {
      await this.delete(vote);
    }

    for (let vote of votes.getNewItems()) {
      await this.save(vote);
    }
  }

  async save(vote: CommentVote): Promise<any> {
    const exists = await this.exists(vote.commentId, vote.memberId, vote.type);
    const isNew = !exists;
    const rawVote = CommentVoteMap.toPersistence(vote);

    if (isNew) {
      try {
        await this.repository.save(rawVote);
      } catch (err) {
        throw new Error(err.toString());
      }
    } else {
      throw new Error("Shouldn't be re-saving a vote. Only deleting and saving.");
    }
  }

  async delete(vote: CommentVote): Promise<any> {
    return this.repository.delete({
      comment_id: vote.commentId.getStringValue(),
      member_id: vote.memberId.getStringValue()
    });
  }

  async getVotesForCommentByMemberId(commentId: CommentId, memberId: MemberId): Promise<CommentVote[]> {
    const votes = await this.repository.find({
      where: {
        comment_id: commentId.getStringValue(),
        member_id: memberId.getStringValue()
      }
    });
    return votes.map((v) => CommentVoteMap.toDomain(v));
  }

  // FIX SQL INJECTION #1: Use QueryBuilder
  async countUpvotesForCommentByCommentId(commentId: CommentId | string): Promise<number> {
    const commentIdString = commentId instanceof CommentId
      ? commentId.getStringValue()
      : commentId;

    const count = await this.repository
      .createQueryBuilder('comment_vote')
      .where('comment_vote.comment_id = :commentId', { commentId: commentIdString })
      .andWhere('comment_vote.type = :type', { type: 'UPVOTE' })
      .getCount();

    return count;
  }

  // FIX SQL INJECTION #2: Use QueryBuilder
  async countDownvotesForCommentByCommentId(commentId: CommentId | string): Promise<number> {
    const commentIdString = commentId instanceof CommentId
      ? commentId.getStringValue()
      : commentId;

    const count = await this.repository
      .createQueryBuilder('comment_vote')
      .where('comment_vote.comment_id = :commentId', { commentId: commentIdString })
      .andWhere('comment_vote.type = :type', { type: 'DOWNVOTE' })
      .getCount();

    return count;
  }

  // FIX SQL INJECTION #3: Complex query with joins - parameterized
  async countAllPostCommentUpvotesExcludingOP(postId: PostId | string): Promise<number> {
    const postIdString = postId instanceof PostId
      ? postId.getStringValue()
      : postId;

    const result = await this.repository
      .createQueryBuilder('cv')
      .innerJoin('comment', 'cm', 'cv.comment_id = cm.comment_id')
      .innerJoin('post', 'p', 'cm.post_id = p.post_id')
      .where('p.post_id = :postId', { postId: postIdString })
      .andWhere('cv.type = :type', { type: 'UPVOTE' })
      .andWhere('cv.member_id != cm.member_id')
      .select('COUNT(DISTINCT cv.comment_id)', 'count')
      .getRawOne();

    return parseInt(result.count) || 0;
  }

  // FIX SQL INJECTION #4: Complex query with joins - parameterized
  async countAllPostCommentDownvotesExcludingOP(postId: PostId | string): Promise<number> {
    const postIdString = postId instanceof PostId
      ? postId.getStringValue()
      : postId;

    const result = await this.repository
      .createQueryBuilder('cv')
      .innerJoin('comment', 'cm', 'cv.comment_id = cm.comment_id')
      .innerJoin('post', 'p', 'cm.post_id = p.post_id')
      .where('p.post_id = :postId', { postId: postIdString })
      .andWhere('cv.type = :type', { type: 'DOWNVOTE' })
      .andWhere('cv.member_id != cm.member_id')
      .select('COUNT(DISTINCT cv.comment_id)', 'count')
      .getRawOne();

    return parseInt(result.count) || 0;
  }

  // FIX SQL INJECTION #5: Complex query with joins - parameterized
  async countAllPostCommentUpvotes(postId: PostId | string): Promise<number> {
    const postIdString = postId instanceof PostId
      ? postId.getStringValue()
      : postId;

    const result = await this.repository
      .createQueryBuilder('cv')
      .innerJoin('comment', 'cm', 'cv.comment_id = cm.comment_id')
      .innerJoin('post', 'p', 'cm.post_id = p.post_id')
      .where('p.post_id = :postId', { postId: postIdString })
      .andWhere('cv.type = :type', { type: 'UPVOTE' })
      .select('COUNT(DISTINCT cv.comment_id)', 'count')
      .getRawOne();

    return parseInt(result.count) || 0;
  }

  // FIX SQL INJECTION #6: Complex query with joins - parameterized
  async countAllPostCommentDownvotes(postId: PostId | string): Promise<number> {
    const postIdString = postId instanceof PostId
      ? postId.getStringValue()
      : postId;

    const result = await this.repository
      .createQueryBuilder('cv')
      .innerJoin('comment', 'cm', 'cv.comment_id = cm.comment_id')
      .innerJoin('post', 'p', 'cm.post_id = p.post_id')
      .where('p.post_id = :postId', { postId: postIdString })
      .andWhere('cv.type = :type', { type: 'DOWNVOTE' })
      .select('COUNT(DISTINCT cv.comment_id)', 'count')
      .getRawOne();

    return parseInt(result.count) || 0;
  }
}
