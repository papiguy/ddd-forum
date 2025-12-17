import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { Member } from './Member';
import { Post } from './Post';
import { CommentVote } from './CommentVote';

@Entity('comment')
export class Comment {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  comment_id: string;

  @Column()
  @Index()
  member_id: string;

  @Column({ nullable: true })
  @Index()
  parent_comment_id: string | null;

  @Column()
  @Index()
  post_id: string;

  @Column()
  text: string;

  @Column({ default: 1 })
  points: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships (manual references - not auto-populated)
  @ManyToOne(() => Member)
  member: Member;

  @ManyToOne(() => Post, post => post.comments)
  post: Post;

  // Self-referencing relationship for nested comments
  @ManyToOne(() => Comment, comment => comment.childComments, {
    nullable: true
  })
  parentComment: Comment | null;

  @OneToMany(() => Comment, comment => comment.parentComment)
  childComments: Comment[];

  @OneToMany(() => CommentVote, vote => vote.comment)
  votes: CommentVote[];
}
