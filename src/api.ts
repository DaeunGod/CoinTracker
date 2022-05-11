const BASE_URL = "https://api.coinpaprika.com/v1";

export async function fetchCoins() {
  return fetch(`${BASE_URL}/coins`).then((resp) => resp.json());
}

export async function fetchCoinInfo(coinId: string) {
  return fetch(`${BASE_URL}/coins/${coinId}`).then((resp) => resp.json());
}

export async function fetchCoinTicker(coinId: string) {
  return fetch(`${BASE_URL}/tickers/${coinId}`).then((resp) => resp.json());
}

export interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

export async function fetchCoinHistory(coinId: string, weeks: number = 2) {
  const endDate = Math.floor(Date.now() / 1000);
  const startDate = endDate - 60 * 60 * 24 * 7 * weeks;

  return fetch(
    `${BASE_URL}/coins/${coinId}/ohlcv/historical?start=${startDate}&end=${endDate}`
  ).then((resp) => resp.json());
}
