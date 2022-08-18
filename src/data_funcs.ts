import axios from "axios";
import { coinElementArray } from "./types";

export let dataArray: coinElementArray = [];

export async function getPrices() {
  let response = await axios
    .get("https://cryptoapilambda.herokuapp.com/coinpaprika")
    .then((res) => {
      dataArray = res.data.all_coins;
    });
  return response;
}
