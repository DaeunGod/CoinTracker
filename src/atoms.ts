import { atom } from "recoil";

export const isDarkAtom = atom({
  key: "isDark",
  default: true,
});

export const showCandleStickChartAtom = atom({
  key: "showCandleStickChart",
  default: false,
});
