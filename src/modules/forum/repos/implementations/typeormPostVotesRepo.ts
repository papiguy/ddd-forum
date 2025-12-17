import { Repository } from 'typeorm';
import { getDataSource } from '../../../../shared/infra/database/typeorm';
import { PostVote as PostVoteEntity } from '../../../../shared/infra/database/typeorm/entities/PostVote';
import { IPostVotesRepo } from "../postVotesRepo";
import { PostVote } from "../../domain/postVote";
import { MemberId } from "../../domain/memberId";
import { PostId } from "../../domain/postId";
import { PostVoteMap } from "../../mappers/postVoteMap";
import { VoteType } from "../../domain/vote";
import { PostVotes } from "../../domain/postVotes";

export class PostVotesRepo implements IPostVotesRepo {
  private repository: Repository<PostVoteEntity>;

  constructor() {
    this.repository = getDataSource().getRepository(PostVoteEntity);
  }

  public async exists(postId: PostId, memberId: MemberId, voteType: VoteType): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        post_id: postId.getStringValue(),
        member_id: memberId.getStringValue(),
        type: voteType
      }
    });
    return count > 0;
  }

  async getVotesForPostByMemberId(postId: PostId, memberId: MemberId): Promise<PostVote[]> {
    const votes = await this.repository.find({
      where: {
        post_id: postId.getStringValue(),
        member_id: memberId.getStringValue()
      }
    });
    return votes.map((v) => PostVoteMap.toDomain(v));
  }

  async save(vote: PostVote): Promise<any> {
    const exists = await this.exists(vote.postId, vote.memberId, vote.type);
    const rawVote = PostVoteMap.toPersistence(vote);

    if (!exists) {
      try {
        await this.repository.save(rawVote);
      } catch (err) {
        throw new Error(err.toString());
      }
    } else {
      throw new Error('Invalid state. Votes arent updated.');
    }
  }

  public async delete(vote: PostVote): Promise<any> {
    return this.repository.delete({
      post_id: vote.postId.getStringValue(),
      member_id: vote.memberId.getStringValue()
    });
  }

  async saveBulk(votes: PostVotes): Promise<any> {
    for (let vote of votes.getRemovedItems()) {
      await this.delete(vote);
    }

    for (let vote of votes.getNewItems()) {
      await this.save(vote);
    }
  }

  // FIX SQL INJECTION: Use QueryBuilder with parameters
  async countPostUpvotesByPostId(postId: PostId | string): Promise<number> {
    const postIdString = postId instanceof PostId
      ? postId.getStringValue()
      : postId;

    const count = await this.repository
      .createQueryBuilder('post_vote')
      .where('post_vote.post_id = :postId', { postId: postIdString })
      .andWhere('post_vote.type = :type', { type: 'UPVOTE' })
      .getCount();

    return count;
  }

  // FIX SQL INJECTION: Use QueryBuilder with parameters
  async countPostDownvotesByPostId(postId: PostId | string): Promise<number> {
    const postIdString = postId instanceof PostId
      ? postId.getStringValue()
      : postId;

    const count = await this.repository
      .createQueryBuilder('post_vote')
      .where('post_vote.post_id = :postId', { postId: postIdString })
      .andWhere('post_vote.type = :type', { type: 'DOWNVOTE' })
      .getCount();

    return count;
  }
}
