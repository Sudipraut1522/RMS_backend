import { AppDataSource } from "../../config/db.js";
import { User } from "./user.entity.js";

export class UserRepository {
  private static get repo() {
    return AppDataSource.getRepository(User);
  }

  static async findByEmail(email: string): Promise<User | null> {
    return await this.repo.findOneBy({ email: email.toLowerCase() });
  }

  static async findById(id: number): Promise<User | null> {
    return await this.repo.findOneBy({ id });
  }

  static async create(userData: Partial<User>): Promise<User> {
    const user = this.repo.create({
      ...userData,
      email: userData.email?.toLowerCase(),
    });
    return await this.repo.save(user);
  }
}
