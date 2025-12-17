import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { Post } from './Post';
import { Member } from './Member';

@Entity('post_vote')
@Index(['post_id', 'member_id'])  // Composite index for lookups
export class PostVote {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  post_vote_id: string;

  @Column()
  post_id: string;

  @Column()
  member_id: string;

  @Column()
  type: string;  // 'UPVOTE' | 'DOWNVOTE'

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships (manual references - not auto-populated)
  @ManyToOne(() => Post, post => post.votes)
  post: Post;

  @ManyToOne(() => Member)
  member: Member;
}
