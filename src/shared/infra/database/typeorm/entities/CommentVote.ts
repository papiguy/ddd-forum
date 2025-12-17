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
import { Comment } from './Comment';
import { Member } from './Member';

@Entity('comment_vote')
@Index(['comment_id', 'member_id'])  // Composite index for lookups
export class CommentVote {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  comment_vote_id: string;

  @Column()
  comment_id: string;

  @Column()
  member_id: string;

  @Column()
  type: string;  // 'UPVOTE' | 'DOWNVOTE'

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships (manual references - not auto-populated)
  @ManyToOne(() => Comment, comment => comment.votes)
  comment: Comment;

  @ManyToOne(() => Member)
  member: Member;
}
