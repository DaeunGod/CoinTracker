import { BrowserRouter, Route, Routes } from "react-router-dom";
import Coins from "./Coins";
import Coin from "./Coin";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:coinId/*" element={<Coin />}></Route>
        <Route path="/" element={<Coins />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
