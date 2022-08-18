import TelegramBot from "node-telegram-bot-api";
import { coins } from "./coins";
import { dataBase } from "./database/database";
import {
  addFavCoin,
  deleteFavCoin,
  getFavCoin,
  validator,
} from "./database/database_funcs";
import { dataArray, getPrices } from "./data_funcs";
import { coinElement, coinElementArray } from "./types";

const token = "5697885905:AAHSzi4do67OnMMdkMBqe9_HLAVHU4t1zn4";
export const bot = new TelegramBot(token, { polling: true });

const followingOptions: any = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "Add to following", callback_data: "add" },
        { text: "Remove from following", callback_data: "remove" },
      ],
    ],
  }),
};

bot.onText(/\/start/, function (msg, match) {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Welcome to the crypto bot,write please /help for more information"
  );
});

bot.onText(/\/listRecent/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Wait a bit...");
  getPrices().then(() => {
    const userOut = dataArray
      .map((el) => `/${el.name}     $${el.price}`)
      .join("\n");
    bot.sendMessage(chatId, userOut);
  });
});

bot.onText(/\/(.+)/, async function (msg, match) {
  const chatId = msg.chat.id;
  if (match != null) {
    if (match[1] === match[1].toUpperCase()) {
      bot.sendMessage(chatId, "Wait a bit...");
      getPrices().then(() => {
        const filtered = dataArray.filter(
          (el: coinElement) => el.name === match[1]
        );
        const userOut = `${match[1]}\n\nprice --- ${filtered[0].price}\n\nprice30m ago --- ${filtered[0].price30m}\nprice1h ago --- ${filtered[0].price1h}\nprice6h ago --- ${filtered[0].price6h}\nprice12h ago --- ${filtered[0].price12h}\nprice 24h ago --- ${filtered[0].price24h}\n`;
        bot.sendMessage(chatId, userOut, followingOptions);
      });
    }
  }
});

bot.onText(/\/addToFavourite (.+)/, async function (msg, match) {
  const chatId = msg.chat.id;
  if (match != null) {
    const symbol = match[1];
    let connection = dataBase.initialize();
    connection.then(async () => {
      await validator(chatId, symbol).then(async (empty) => {
        if (empty === false) {
          bot.sendMessage(chatId, "You have already added this coin");
        } else {
          await addFavCoin(chatId, symbol);

          bot.sendMessage(chatId, `Added ${symbol} to favourites!`);
        }
      });
      await (await connection).destroy();
    });
  }
});

bot.onText(/\/deleteFavourite (.+)/, async function (msg, match) {
  const chatId = msg.chat.id;
  if (match != null) {
    const symbol = match[1];
    let connection = dataBase.initialize();
    connection.then(async () => {
      await deleteFavCoin(chatId, symbol);
      bot.sendMessage(chatId, `Deleted ${symbol} from favourites!`);
      await (await connection).destroy();
    });
  }
});

bot.onText(/\/listFavourite/, async function (msg, match) {
  const chatId = msg.chat.id;
  let response = await getFavCoin(chatId);
  let coinsSymbs: any[] = [];
  response.forEach((el: any) => {
    coinsSymbs.push(el.symbol);
  });
  getPrices().then(() => {
    let value;
    let data: coinElementArray = [];
    for (value in coinsSymbs) {
      let coin = coinsSymbs[value as keyof typeof coins];
      dataArray.map((el: coinElement) => {
        if (coin === el.name) {
          data.push(el);
        }
      });
    }
    const userOut = data.map((el) => `/${el.name}     $${el.price}`).join("\n");
    bot.sendMessage(chatId, `Your favourite coins:\n${userOut}`);
  });
});

bot.on("callback_query", async (msg) => {
  let symbol: string = msg.message!.text!.substring(
    0,
    msg.message!.text!.indexOf("\n")
  );

  const data = msg.data;

  const chatId: number = msg.message!.chat.id;
  let connection = dataBase.initialize();
  connection.then(async () => {
    if (data === "add") {
      await validator(chatId, symbol).then(async (empty) => {
        if (empty === false) {
          bot.sendMessage(chatId, "You have already added this coin");
        } else {
          if (symbol) {
            await addFavCoin(chatId, symbol);
            bot.sendMessage(chatId, `Added ${symbol} to favourites!`);
          }
        }
        (await connection).destroy();
      });
    }
    if (data === "remove") {
      await deleteFavCoin(chatId, symbol);
      bot.sendMessage(chatId, `Deleted ${symbol} from favourites!`);
    }
    (await connection).destroy();
  });
});

bot.setMyCommands([{ command: "/help", description: "Как бот работает" }]);

bot.on("message", async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (text === "/help") {
    return bot.sendMessage(
      chatId,
      'Привет,вот список доступных команд:\n/listRecent - получить список популярной крипты.\n/{currency_symbol} получить подробную информацию о криптовалюте.\n/addToFavourite {currency_symbol} - добавляет крипту в раздел "избранное"\n/listFavourite - возвращает список избранной крипты\n/deleteFavourite {currency_symbol} - удаляет крипту из избранного.'
    );
  }
});
