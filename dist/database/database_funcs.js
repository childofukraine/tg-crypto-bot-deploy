"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavCoin = exports.deleteFavCoin = exports.validator = exports.addFavCoin = void 0;
const database_1 = require("./database");
const Favourites_1 = require("./models/Favourites");
const addFavCoin = (chatId, symbol) => __awaiter(void 0, void 0, void 0, function* () {
    const favRepo = database_1.dataBase.getRepository(Favourites_1.Favourites);
    const favCoin = favRepo.create({ chatId: chatId, symbol: symbol });
    yield favRepo.save(favCoin);
});
exports.addFavCoin = addFavCoin;
const validator = (chatId, symbol) => __awaiter(void 0, void 0, void 0, function* () {
    let empty;
    const favRepo = database_1.dataBase.getRepository(Favourites_1.Favourites);
    const check = yield favRepo.query(`SELECT * FROM favourites WHERE chatId = ${chatId} AND symbol = "${symbol}"`);
    if (check.length === 0) {
        empty = true;
    }
    else {
        empty = false;
    }
    return empty;
});
exports.validator = validator;
const deleteFavCoin = (chatId, symbol) => __awaiter(void 0, void 0, void 0, function* () {
    const favRepo = database_1.dataBase.getRepository(Favourites_1.Favourites);
    yield favRepo.query(`DELETE FROM favourites WHERE chatId = ${chatId} AND symbol = "${symbol}"`);
});
exports.deleteFavCoin = deleteFavCoin;
const getFavCoin = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    let connection = database_1.dataBase.initialize();
    let allFavs;
    const result = connection.then(() => __awaiter(void 0, void 0, void 0, function* () {
        const favRepo = database_1.dataBase.getRepository(Favourites_1.Favourites);
        allFavs = yield favRepo.query(`SELECT * FROM favourites WHERE chatId = ${chatId}`);
        (yield connection).destroy();
        return allFavs;
    }));
    return result;
});
exports.getFavCoin = getFavCoin;
