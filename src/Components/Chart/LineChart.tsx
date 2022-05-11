import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { IHistorical } from "../../api";
import { isDarkAtom } from "../../atoms";

interface LineChartProps {
  history: IHistorical[];
}
const LineChart = ({ history }: LineChartProps) => {
  const isDarkTheme = useRecoilValue(isDarkAtom);

  return (
    <ApexChart
      type="line"
      options={{
        theme: {
          mode: isDarkTheme ? "dark" : "light",
        },
        chart: {
          height: 500,
          width: 500,
          toolbar: {
            show: false,
          },
          background: "transparent",
        },
        grid: {
          show: false,
        },
        yaxis: {
          show: false,
        },
        xaxis: {
          labels: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          type: "datetime",
          categories: history.map((price) => price.time_close),
        },
        tooltip: {
          y: {
            formatter: (val) => `$ ${val.toFixed(3)}`,
          },
        },
      }}
      series={[
        {
          name: "Price",
          data: history.map((price) => price.close) ?? [],
        },
      ]}
    />
  );
};

export default LineChart;
