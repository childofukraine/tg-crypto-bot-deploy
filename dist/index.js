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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const database_1 = require("./database/database");
const database_funcs_1 = require("./database/database_funcs");
const data_funcs_1 = require("./data_funcs");
const token = "5697885905:AAHSzi4do67OnMMdkMBqe9_HLAVHU4t1zn4";
exports.bot = new node_telegram_bot_api_1.default(token, { polling: true });
const followingOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [
                { text: "Add to following", callback_data: "add" },
                { text: "Remove from following", callback_data: "remove" },
            ],
        ],
    }),
};
exports.bot.onText(/\/start/, function (msg, match) {
    const chatId = msg.chat.id;
    exports.bot.sendMessage(chatId, "Welcome to the crypto bot,write please /help for more information");
});
exports.bot.onText(/\/listRecent/, (msg, match) => {
    const chatId = msg.chat.id;
    exports.bot.sendMessage(chatId, "Wait a bit...");
    (0, data_funcs_1.getPrices)().then(() => {
        const userOut = data_funcs_1.dataArray
            .map((el) => `/${el.name}     $${el.price}`)
            .join("\n");
        exports.bot.sendMessage(chatId, userOut);
    });
});
exports.bot.onText(/\/(.+)/, function (msg, match) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        if (match != null) {
            if (match[1] === match[1].toUpperCase()) {
                exports.bot.sendMessage(chatId, "Wait a bit...");
                (0, data_funcs_1.getPrices)().then(() => {
                    const filtered = data_funcs_1.dataArray.filter((el) => el.name === match[1]);
                    const userOut = `${match[1]}\n\nprice --- ${filtered[0].price}\n\nprice30m ago --- ${filtered[0].price30m}\nprice1h ago --- ${filtered[0].price1h}\nprice6h ago --- ${filtered[0].price6h}\nprice12h ago --- ${filtered[0].price12h}\nprice 24h ago --- ${filtered[0].price24h}\n`;
                    exports.bot.sendMessage(chatId, userOut, followingOptions);
                });
            }
        }
    });
});
exports.bot.onText(/\/addToFavourite (.+)/, function (msg, match) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        if (match != null) {
            const symbol = match[1];
            let connection = database_1.dataBase.initialize();
            connection.then(() => __awaiter(this, void 0, void 0, function* () {
                yield (0, database_funcs_1.validator)(chatId, symbol).then((empty) => __awaiter(this, void 0, void 0, function* () {
                    if (empty === false) {
                        exports.bot.sendMessage(chatId, "You have already added this coin");
                    }
                    else {
                        yield (0, database_funcs_1.addFavCoin)(chatId, symbol);
                        exports.bot.sendMessage(chatId, `Added ${symbol} to favourites!`);
                    }
                }));
                yield (yield connection).destroy();
            }));
        }
    });
});
exports.bot.onText(/\/deleteFavourite (.+)/, function (msg, match) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        if (match != null) {
            const symbol = match[1];
            let connection = database_1.dataBase.initialize();
            connection.then(() => __awaiter(this, void 0, void 0, function* () {
                yield (0, database_funcs_1.deleteFavCoin)(chatId, symbol);
                exports.bot.sendMessage(chatId, `Deleted ${symbol} from favourites!`);
                yield (yield connection).destroy();
            }));
        }
    });
});
exports.bot.onText(/\/listFavourite/, function (msg, match) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        let response = yield (0, database_funcs_1.getFavCoin)(chatId);
        let coinsSymbs = [];
        response.forEach((el) => {
            coinsSymbs.push(el.symbol);
        });
        (0, data_funcs_1.getPrices)().then(() => {
            let value;
            let data = [];
            for (value in coinsSymbs) {
                let coin = coinsSymbs[value];
                data_funcs_1.dataArray.map((el) => {
                    if (coin === el.name) {
                        data.push(el);
                    }
                });
            }
            const userOut = data.map((el) => `/${el.name}     $${el.price}`).join("\n");
            exports.bot.sendMessage(chatId, `Your favourite coins:\n${userOut}`);
        });
    });
});
exports.bot.on("callback_query", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    let symbol = msg.message.text.substring(0, msg.message.text.indexOf("\n"));
    const data = msg.data;
    const chatId = msg.message.chat.id;
    let connection = database_1.dataBase.initialize();
    connection.then(() => __awaiter(void 0, void 0, void 0, function* () {
        if (data === "add") {
            yield (0, database_funcs_1.validator)(chatId, symbol).then((empty) => __awaiter(void 0, void 0, void 0, function* () {
                if (empty === false) {
                    exports.bot.sendMessage(chatId, "You have already added this coin");
                }
                else {
                    if (symbol) {
                        yield (0, database_funcs_1.addFavCoin)(chatId, symbol);
                        exports.bot.sendMessage(chatId, `Added ${symbol} to favourites!`);
                    }
                }
                (yield connection).destroy();
            }));
        }
        if (data === "remove") {
            yield (0, database_funcs_1.deleteFavCoin)(chatId, symbol);
            exports.bot.sendMessage(chatId, `Deleted ${symbol} from favourites!`);
        }
        (yield connection).destroy();
    }));
}));
exports.bot.setMyCommands([{ command: "/help", description: "Как бот работает" }]);
exports.bot.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/help") {
        return exports.bot.sendMessage(chatId, 'Привет,вот список доступных команд:\n/listRecent - получить список популярной крипты.\n/{currency_symbol} получить подробную информацию о криптовалюте.\n/addToFavourite {currency_symbol} - добавляет крипту в раздел "избранное"\n/listFavourite - возвращает список избранной крипты\n/deleteFavourite {currency_symbol} - удаляет крипту из избранного.');
    }
}));
