import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { BaseUser } from './BaseUser';
import { Post } from './Post';

@Entity('member')
export class Member {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  member_id: string;

  @Column()
  member_base_id: string;

  @Column({ default: 0 })
  reputation: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships (manual references - not auto-populated)
  @OneToOne(() => BaseUser, baseUser => baseUser.member)
  baseUser: BaseUser;

  @OneToMany(() => Post, post => post.member)
  posts: Post[];
}
