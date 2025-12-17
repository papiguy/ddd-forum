import { Repository } from 'typeorm';
import { getDataSource } from '../../../../shared/infra/database/typeorm';
import { Member as MemberEntity } from '../../../../shared/infra/database/typeorm/entities/Member';
import { IMemberRepo } from "../memberRepo";
import { Member } from "../../domain/member";
import { MemberMap } from "../../mappers/memberMap";
import { MemberDetails } from "../../domain/memberDetails";
import { MemberDetailsMap } from "../../mappers/memberDetailsMap";
import { MemberId } from "../../domain/memberId";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { MemberIdMap } from "../../mappers/memberIdMap";

export class MemberRepo implements IMemberRepo {
  private repository: Repository<MemberEntity>;

  constructor() {
    this.repository = getDataSource().getRepository(MemberEntity);
  }

  public async exists(userId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { member_base_id: userId }
    });
    return count > 0;
  }

  public async getMemberDetailsByPostLinkOrSlug(linkOrSlug: string): Promise<MemberDetails> {
    const member = await this.repository
      .createQueryBuilder('member')
      .innerJoinAndSelect('member.baseUser', 'baseUser')
      .innerJoin('member.posts', 'post')
      .where('post.slug = :linkOrSlug OR post.link = :linkOrSlug', { linkOrSlug })
      .getOne();

    if (!member) throw new Error('Member not found');
    return MemberDetailsMap.toDomain(member);
  }

  public async getMemberIdByUserId(userId: string): Promise<MemberId> {
    const member = await this.repository.findOne({
      where: { member_base_id: userId },
      relations: ['baseUser']
    });

    if (!member) throw new Error('Member id not found');
    return MemberIdMap.toDomain(member);
  }

  public async getMemberByUserId(userId: string): Promise<Member> {
    const member = await this.repository.findOne({
      where: { member_base_id: userId },
      relations: ['baseUser']
    });

    if (!member) throw new Error("Member not found");
    return MemberMap.toDomain(member);
  }

  public async getMemberByUserName(username: string): Promise<Member> {
    const member = await this.repository
      .createQueryBuilder('member')
      .innerJoinAndSelect('member.baseUser', 'baseUser')
      .where('baseUser.username = :username', { username })
      .getOne();

    if (!member) throw new Error("Member not found");
    return MemberMap.toDomain(member);
  }

  public async getMemberDetailsByUserName(username: string): Promise<MemberDetails> {
    const member = await this.repository
      .createQueryBuilder('member')
      .innerJoinAndSelect('member.baseUser', 'baseUser')
      .where('baseUser.username = :username', { username })
      .getOne();

    if (!member) throw new Error("Member not found");
    return MemberDetailsMap.toDomain(member);
  }

  public async save(member: Member): Promise<void> {
    const exists = await this.exists(member.userId.getStringValue());

    if (!exists) {
      const rawMember = await MemberMap.toPersistence(member);
      await this.repository.save(rawMember);
    }

    return;
  }
}
