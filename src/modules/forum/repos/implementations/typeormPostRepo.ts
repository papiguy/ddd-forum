import { Repository } from 'typeorm';
import { getDataSource } from '../../../../shared/infra/database/typeorm';
import { Post as PostEntity } from '../../../../shared/infra/database/typeorm/entities/Post';
import { Comment as CommentEntity } from '../../../../shared/infra/database/typeorm/entities/Comment';
import { IPostRepo } from "../postRepo";
import { PostId } from "../../domain/postId";
import { Post } from "../../domain/post";
import { PostMap } from "../../mappers/postMap";
import { PostDetails } from "../../domain/postDetails";
import { PostDetailsMap } from "../../mappers/postDetailsMap";
import { ICommentRepo } from "../commentRepo";
import { IPostVotesRepo } from "../postVotesRepo";
import { PostVotes } from "../../domain/postVotes";
import { Comments } from "../../domain/comments";

export class PostRepo implements IPostRepo {
  private repository: Repository<PostEntity>;
  private commentRepo: ICommentRepo;
  private postVotesRepo: IPostVotesRepo;

  constructor(commentRepo: ICommentRepo, postVotesRepo: IPostVotesRepo) {
    this.repository = getDataSource().getRepository(PostEntity);
    this.commentRepo = commentRepo;
    this.postVotesRepo = postVotesRepo;
  }

  public async getPostByPostId(postId: PostId | string): Promise<Post> {
    const postIdString = postId instanceof PostId
      ? postId.getStringValue()
      : postId;

    const post = await this.repository.findOne({
      where: { post_id: postIdString }
    });

    if (!post) throw new Error("Post not found");
    return PostMap.toDomain(post);
  }

  // FIX SQL INJECTION: Replace raw query with QueryBuilder
  public async getNumberOfCommentsByPostId(postId: PostId | string): Promise<number> {
    const postIdString = postId instanceof PostId
      ? postId.getStringValue()
      : postId;

    const count = await getDataSource()
      .getRepository(CommentEntity)
      .createQueryBuilder('comment')
      .where('comment.post_id = :postId', { postId: postIdString })
      .getCount();

    return count;
  }

  public async getPostDetailsBySlug(slug: string): Promise<PostDetails> {
    const post = await this.repository.findOne({
      where: { slug },
      relations: ['member', 'member.baseUser']
    });

    if (!post) throw new Error("Post not found");
    return PostDetailsMap.toDomain(post);
  }

  public async getRecentPosts(offset?: number): Promise<PostDetails[]> {
    const posts = await this.repository.find({
      relations: ['member', 'member.baseUser'],
      order: { created_at: 'DESC' },
      skip: offset || 0,
      take: 15
    });

    return posts.map((p) => PostDetailsMap.toDomain(p));
  }

  public async getPopularPosts(offset?: number): Promise<PostDetails[]> {
    const posts = await this.repository.find({
      relations: ['member', 'member.baseUser'],
      order: { points: 'DESC' },
      skip: offset || 0,
      take: 15
    });

    return posts.map((p) => PostDetailsMap.toDomain(p));
  }

  public async getPostBySlug(slug: string): Promise<Post> {
    const post = await this.repository.findOne({
      where: { slug }
    });

    if (!post) throw new Error("Post not found");
    return PostMap.toDomain(post);
  }

  public async exists(postId: PostId): Promise<boolean> {
    const count = await this.repository.count({
      where: { post_id: postId.getStringValue() }
    });
    return count > 0;
  }

  public delete(postId: PostId): Promise<void> {
    return this.repository.delete({ post_id: postId.getStringValue() }).then(() => {});
  }

  private saveComments(comments: Comments) {
    return this.commentRepo.saveBulk(comments.getItems());
  }

  private savePostVotes(postVotes: PostVotes) {
    return this.postVotesRepo.saveBulk(postVotes);
  }

  public async save(post: Post): Promise<void> {
    const PostModel = this.repository;
    const exists = await this.exists(post.postId);
    const isNewPost = !exists;
    const rawPost = await PostMap.toPersistence(post);

    if (isNewPost) {
      try {
        // Create in transaction to ensure atomicity
        await getDataSource().transaction(async (transactionalEntityManager) => {
          await transactionalEntityManager.save(PostEntity, rawPost);
          await this.saveComments(post.comments);
          await this.savePostVotes(post.getVotes());
        });
      } catch (err) {
        await this.delete(post.postId);
        throw new Error(err.toString());
      }
    } else {
      // Save child entities first, then parent
      // so that any domain events on the aggregate get dispatched
      await this.saveComments(post.comments);
      await this.savePostVotes(post.getVotes());

      await PostModel.save(rawPost);
    }
  }
}
