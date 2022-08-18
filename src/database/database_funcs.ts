import { dataBase } from "./database";
import { Favourites } from "./models/Favourites";

export const addFavCoin = async (chatId: number, symbol: string) => {
  const favRepo = dataBase.getRepository(Favourites);
  const favCoin = favRepo.create({ chatId: chatId, symbol: symbol });
  await favRepo.save(favCoin);
};

export const validator = async (chatId: number, symbol: string) => {
  let empty;
  const favRepo = dataBase.getRepository(Favourites);
  const check: any[] = await favRepo.query(
    `SELECT * FROM favourites WHERE chatId = ${chatId} AND symbol = "${symbol}"`
  );
  if (check.length === 0) {
    empty = true;
  } else {
    empty = false;
  }
  return empty;
};

export const deleteFavCoin = async (chatId: number, symbol: string) => {
  const favRepo = dataBase.getRepository(Favourites);
  await favRepo.query(
    `DELETE FROM favourites WHERE chatId = ${chatId} AND symbol = "${symbol}"`
  );
};

export const getFavCoin = async (chatId: number) => {
  let connection = dataBase.initialize();
  let allFavs;
  const result = connection.then(async () => {
    const favRepo = dataBase.getRepository(Favourites);
    allFavs = await favRepo.query(
      `SELECT * FROM favourites WHERE chatId = ${chatId}`
    );
    (await connection).destroy();
    return allFavs;
  });
  return result;
};
