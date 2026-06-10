import { AppDataSource } from "../../config/db.js";
import { Item } from "./item.entity.js";
import { CreateItemInput } from "./item.types.js";

export class ItemRepository {
  private static get repo() {
    return AppDataSource.getRepository(Item);
  }

  static async create(input: CreateItemInput): Promise<Item> {
    const item = new Item();
    item.name = input.name;
    item.price = input.price;
    item.imageUrl = input.image_url || null;
    item.cloudinaryId = input.cloudinary_id || null;

    return await this.repo.save(item);
  }

  static async findAll(): Promise<Item[]> {
    return await this.repo.find({
      order: {
        createdAt: "DESC",
      },
    });
  }

  static async findById(id: number): Promise<Item | null> {
    return await this.repo.findOneBy({ id });
  }
}
