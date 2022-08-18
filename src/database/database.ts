import "reflect-metadata";
import { DataSource } from "typeorm";
import { Favourites } from "./models/Favourites";

export const dataBase = new DataSource({
  type: "mysql",
  host: "database-telegram.cnz3wto1hwqt.eu-central-1.rds.amazonaws.com",
  port: 3306,
  username: "admin",
  password: "12345678",
  database: "my_tg_db",
  synchronize: true,
  logging: false,
  entities: [Favourites],
  migrations: [],
  subscribers: [],
});
