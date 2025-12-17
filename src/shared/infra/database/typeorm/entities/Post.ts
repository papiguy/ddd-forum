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
import { PostVote } from './PostVote';
import { Comment } from './Comment';

@Entity('post')
export class Post {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  post_id: string;

  @Column()
  @Index()
  member_id: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  title: string | null;

  @Column({ nullable: true })
  text: string | null;

  @Column({ nullable: true })
  link: string | null;

  @Column()
  @Index()
  slug: string;

  @Column({ default: 0 })
  points: number;

  @Column({ default: 0 })
  total_num_comments: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships (manual references - not auto-populated)
  @ManyToOne(() => Member, member => member.posts)
  member: Member;

  @OneToMany(() => PostVote, vote => vote.post)
  votes: PostVote[];

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];
}
