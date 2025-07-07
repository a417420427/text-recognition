import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

const config = dotenv.config().parsed || {};

export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.DB_HOST || "localhost",
  port: parseInt(config.DB_PORT || "3306"),
  username: config.DB_USER || "root",
  password: config.DB_PASS || "password",
  database: config.DB_NAME || "ocr_app",
  synchronize: true, // 开发时自动同步实体到数据库，生产建议 false + 手动迁移
  logging: false,
  entities: [__dirname + "/entities/*.{ts,js}"],
  migrations: [__dirname + "/migrations/*.{ts,js}"],

  subscribers: [],
});
