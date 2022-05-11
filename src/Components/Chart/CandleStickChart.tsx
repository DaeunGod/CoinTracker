import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { IHistorical } from "../../api";
import { isDarkAtom } from "../../atoms";

interface CandleStickChartProps {
  history: IHistorical[];
}

const CandleStickChart = ({ history }: CandleStickChartProps) => {
  const isDarkTheme = useRecoilValue(isDarkAtom);

  return (
    <ApexChart
      type="candlestick"
      options={{
        theme: {
          mode: isDarkTheme ? "dark" : "light",
        },
        chart: {
          height: 500,
          width: 500,
          background: "transparent",
        },
        yaxis: {
          tooltip: {
            enabled: true,
          },
          decimalsInFloat: 1,
        },
        xaxis: {
          type: "datetime",
        },
      }}
      series={[
        {
          data: history.map(({ time_close, open, high, low, close }) => ({
            x: new Date(time_close),
            y: [open, high, low, close],
          })),
        },
      ]}
    />
  );
};

export default CandleStickChart;
