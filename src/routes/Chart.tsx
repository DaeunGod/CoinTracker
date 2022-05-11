import { useQuery } from "react-query";
import { fetchCoinHistory, IHistorical } from "../api";

import LineChart from "../Components/Chart/LineChart";
import CandleStickChart from "../Components/Chart/CandleStickChart";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { showCandleStickChartAtom } from "../atoms";

interface IChartProp {
  coinId: string;
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Tab = styled.div`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: ${(props) => props.theme.tabColor};
  padding: 7px 0px;
  border-radius: 10px;
  cursor: pointer;
  width: 30%;
`;

const Chart = ({ coinId }: IChartProp) => {
  const { isLoading, data: history } = useQuery<IHistorical[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000,
    }
  );

  const [showCandleStickChart, setShowCandleStickChart] = useRecoilState(
    showCandleStickChartAtom
  );

  const onClick = () => {
    setShowCandleStickChart((prev) => !prev);
  };

  return (
    <div>
      {isLoading ? (
        "Loading..."
      ) : (
        <>
          {showCandleStickChart ? (
            <CandleStickChart history={history!} />
          ) : (
            <LineChart history={history!} />
          )}
          <Wrapper>
            <Tab onClick={onClick}>
              {showCandleStickChart
                ? "Show LineChart"
                : "Show CandleStickChart"}
            </Tab>
          </Wrapper>
        </>
      )}
    </div>
  );
};

export default Chart;
