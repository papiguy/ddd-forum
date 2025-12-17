import { Repository } from 'typeorm';
import { getDataSource } from '../../../../shared/infra/database/typeorm';
import { BaseUser } from '../../../../shared/infra/database/typeorm/entities/BaseUser';
import { IUserRepo } from "../userRepo";
import { UserName } from "../../domain/userName";
import { User } from "../../domain/user";
import { UserMap } from "../../mappers/userMap";
import { UserEmail } from "../../domain/userEmail";

export class UserRepo implements IUserRepo {
  private repository: Repository<BaseUser>;

  constructor() {
    this.repository = getDataSource().getRepository(BaseUser);
  }

  async exists(userEmail: UserEmail): Promise<boolean> {
    const count = await this.repository.count({
      where: { user_email: userEmail.value }
    });
    return count > 0;
  }

  async getUserByUserName(userName: UserName | string): Promise<User> {
    const usernameValue = userName instanceof UserName
      ? userName.value
      : userName;

    const baseUser = await this.repository.findOne({
      where: { username: usernameValue }
    });

    if (!baseUser) throw new Error("User not found.");
    return UserMap.toDomain(baseUser);
  }

  async getUserByUserId(userId: string): Promise<User> {
    const baseUser = await this.repository.findOne({
      where: { base_user_id: userId }
    });

    if (!baseUser) throw new Error("User not found.");
    return UserMap.toDomain(baseUser);
  }

  async save(user: User): Promise<void> {
    const exists = await this.exists(user.email);

    if (!exists) {
      const rawUser = await UserMap.toPersistence(user);
      await this.repository.save(rawUser);
    }

    return;
  }
}
