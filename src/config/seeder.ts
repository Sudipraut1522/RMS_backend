import bcrypt from "bcrypt";
import { AppDataSource } from "./db.js";
import { User, UserRole } from "../modules/user/user.entity.js";
import { Item } from "../modules/item/item.entity.js";
import { logger } from "../utils/logger.js";
import { config } from "./index.js";

export const seedDatabase = async (): Promise<void> => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const itemRepo = AppDataSource.getRepository(Item);

    // 1. Seed default user if empty
    const userCount = await userRepo.count();
    if (userCount === 0) {
      logger.info("Seeding default admin user...");
      const hashedPassword = await bcrypt.hash("password123", config.auth.saltRounds);
      
      const admin = userRepo.create({
        name: "sudip",
        email: "sudip@example.com",
        password: hashedPassword,
        role: UserRole.ADMIN,
      });
      await userRepo.save(admin);
      logger.info("Default admin user seeded: sudip@example.com / password123");
    }

    // 2. Seed default items if empty
    const itemCount = await itemRepo.count();
    if (itemCount === 0) {
      logger.info("Seeding default menu items...");
      const defaultItems = [
        { name: "Classic Cheeseburger", price: 13.99 },
        { name: "Margherita Pizza", price: 14.99 },
        { name: "Spaghetti Carbonara", price: 16.50 },
        { name: "Ribeye Steak", price: 28.00 },
        { name: "Caesar Salad", price: 9.99 },
        { name: "French Fries", price: 5.99 },
        { name: "Buffalo Wings", price: 11.50 },
        { name: "Garlic Focaccia", price: 6.99 },
        { name: "Coca Cola Classic", price: 2.99 },
        { name: "Latte Macchiato", price: 4.25 },
        { name: "IPA Craft Beer", price: 7.50 },
        { name: "Classic Mojito", price: 9.00 },
        { name: "Gelato Trio", price: 7.50 },
        { name: "Chocolate Fudge Cake", price: 8.50 },
        { name: "Warm Apple Pie", price: 7.99 }
      ];

      for (const itemData of defaultItems) {
        const item = itemRepo.create({
          name: itemData.name,
          price: itemData.price,
          imageUrl: null,
          cloudinaryId: null
        });
        await itemRepo.save(item);
      }
      logger.info(`Seeded ${defaultItems.length} default menu items.`);
    }
  } catch (error) {
    logger.error("Failed to seed database:", error);
  }
};
