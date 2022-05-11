import { Link, useMatch } from "react-router-dom";
import {
  useLocation,
  useParams,
  Location,
  Routes,
  Route,
} from "react-router-dom";
import styled from "styled-components";
import Chart from "./Chart";
import Price from "./Price";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTicker } from "../api";
import { Helmet } from "react-helmet-async";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderSpaceWrapper = styled.div`
  width: 36px;
  height: 36px;
  position: relative;
  top: 10px;

  img {
    width: 100%;
    height: 100%;

    &:hover {
      box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme.tabColor};
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: ${(props) => props.theme.tabColor};
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

interface RouteState extends Location {
  state: {
    name: string;
  };
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface USDPrice {
  price: number;
  volume_24h: number;
  volume_24h_change_24h: number;
  market_cap: number;
  market_cap_change_24h: number;
  percent_change_15m: number;
  percent_change_30m: number;
  percent_change_1h: number;
  percent_change_6h: number;
  percent_change_12h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  percent_change_1y: number;
  ath_price: number;
  ath_date: string;
  percent_from_price_ath: number;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: USDPrice;
  };
}

const WHITE_MODE_BACK_IMG =
  "data:image/svg+xml;base64,PHN2ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMTIuMDE3IDEuOTk1YzUuNTE3IDAgOS45OTcgNC40OCA5Ljk5NyA5Ljk5OHMtNC40OCA5Ljk5OC05Ljk5NyA5Ljk5OGMtNS41MTggMC05Ljk5OC00LjQ4LTkuOTk4LTkuOTk4czQuNDgtOS45OTggOS45OTgtOS45OTh6bTAgMS41Yy00LjY5IDAtOC40OTggMy44MDgtOC40OTggOC40OThzMy44MDggOC40OTggOC40OTggOC40OTggOC40OTctMy44MDggOC40OTctOC40OTgtMy44MDctOC40OTgtOC40OTctOC40OTh6bS0xLjUyOCA0LjcxNXMtMS41MDIgMS41MDUtMy4yNTUgMy4yNTljLS4xNDcuMTQ3LS4yMi4zMzktLjIyLjUzMXMuMDczLjM4My4yMi41M2MxLjc1MyAxLjc1NCAzLjI1NCAzLjI1OCAzLjI1NCAzLjI1OC4xNDUuMTQ1LjMzNS4yMTcuNTI2LjIxNy4xOTItLjAwMS4zODQtLjA3NC41MzEtLjIyMS4yOTItLjI5My4yOTQtLjc2Ni4wMDMtMS4wNTdsLTEuOTc3LTEuOTc3aDYuNjkzYy40MTQgMCAuNzUtLjMzNi43NS0uNzVzLS4zMzYtLjc1LS43NS0uNzVoLTYuNjkzbDEuOTc4LTEuOTc5Yy4yOS0uMjg5LjI4Ny0uNzYyLS4wMDYtMS4wNTQtLjE0Ny0uMTQ3LS4zMzktLjIyMS0uNTMtLjIyMi0uMTkgMC0uMzguMDcxLS41MjQuMjE1eiIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9zdmc+";
const DARK_MODE_BACK_IMG =
  "data:image/svg+xml;base64,PHN2ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMTIuMDEyIDJjNS41MTggMCA5Ljk5NyA0LjQ4IDkuOTk3IDkuOTk4IDAgNS41MTctNC40NzkgOS45OTctOS45OTcgOS45OTdzLTkuOTk4LTQuNDgtOS45OTgtOS45OTdjMC01LjUxOCA0LjQ4LTkuOTk4IDkuOTk4LTkuOTk4em0tMS41MjMgNi4yMXMtMS41MDIgMS41MDUtMy4yNTUgMy4yNTljLS4xNDcuMTQ3LS4yMi4zMzktLjIyLjUzMXMuMDczLjM4My4yMi41M2MxLjc1MyAxLjc1NCAzLjI1NCAzLjI1OCAzLjI1NCAzLjI1OC4xNDUuMTQ1LjMzNS4yMTcuNTI2LjIxNy4xOTItLjAwMS4zODQtLjA3NC41MzEtLjIyMS4yOTItLjI5My4yOTQtLjc2Ni4wMDMtMS4wNTdsLTEuOTc3LTEuOTc3aDYuNjkzYy40MTQgMCAuNzUtLjMzNi43NS0uNzVzLS4zMzYtLjc1LS43NS0uNzVoLTYuNjkzbDEuOTc4LTEuOTc5Yy4yOS0uMjg5LjI4Ny0uNzYyLS4wMDYtMS4wNTQtLjE0Ny0uMTQ3LS4zMzktLjIyMS0uNTMtLjIyMi0uMTkgMC0uMzguMDcxLS41MjQuMjE1eiIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9zdmc+";

const Coin = () => {
  const { coinId } = useParams<"coinId">();

  const { state } = useLocation() as RouteState;

  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");
  const isDarkMode = useRecoilValue(isDarkAtom);

  const { isLoading: infoLoading, data: info } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId!),
    {
      refetchInterval: 5000,
    }
  );
  const { isLoading: tickerLoading, data: ticker } = useQuery<PriceData>(
    ["ticker", coinId],
    () => fetchCoinTicker(coinId!)
  );

  const loading = infoLoading || tickerLoading;

  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : info?.name}
        </title>
      </Helmet>
      <Header>
        <nav>
          <HeaderSpaceWrapper>
            <Link to="/">
              <img
                src={isDarkMode ? DARK_MODE_BACK_IMG : WHITE_MODE_BACK_IMG}
                alt="Back"
              />
            </Link>
          </HeaderSpaceWrapper>
        </nav>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : info?.name}
        </Title>
        <HeaderSpaceWrapper />
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{info?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>{info?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>{ticker?.quotes.USD.price}</span>
            </OverviewItem>
          </Overview>
          <Description>{info?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Supply:</span>
              <span>{ticker?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{ticker?.max_supply}</span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to="chart">Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to="price">Price</Link>
            </Tab>
          </Tabs>
          <Routes>
            <Route path="chart" element={<Chart coinId={coinId!} />} />
            <Route path="price" element={<Price coinId={coinId!} />} />
          </Routes>
        </>
      )}
    </Container>
  );
};

export default Coin;
