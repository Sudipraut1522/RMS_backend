import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "./index.js";
import { Item } from "../modules/item/item.entity.js";
import { User } from "../modules/user/user.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.database,
  synchronize: config.env !== "production", // Automatically creates/updates table schemas in development
  logging: config.env !== "production" ? ["error", "query"] : ["error"],
  entities: [Item, User],
  migrations: [],
  subscribers: [],
});
