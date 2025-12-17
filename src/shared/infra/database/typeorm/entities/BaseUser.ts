import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Index
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { Member } from './Member';

@Entity('base_user')
export class BaseUser {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  base_user_id: string;

  @Column({ unique: true })
  @Index()
  user_email: string;

  @Column({ default: false })
  is_email_verified: boolean;

  @Column()
  username: string;

  @Column({ nullable: true, default: null })
  user_password: string | null;

  @Column({ default: false })
  is_admin_user: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationship (manual reference - not auto-populated)
  @OneToOne(() => Member, member => member.baseUser)
  member: Member;
}
