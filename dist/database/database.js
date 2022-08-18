"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataBase = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Favourites_1 = require("./models/Favourites");
exports.dataBase = new typeorm_1.DataSource({
    type: "mysql",
    host: "database-telegram.cnz3wto1hwqt.eu-central-1.rds.amazonaws.com",
    port: 3306,
    username: "admin",
    password: "12345678",
    database: "my_tg_db",
    synchronize: true,
    logging: false,
    entities: [Favourites_1.Favourites],
    migrations: [],
    subscribers: [],
});
