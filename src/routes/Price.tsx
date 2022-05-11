import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { fetchCoinHistory, IHistorical } from "../api";
import { isDarkAtom } from "../atoms";
import ApexChart from "react-apexcharts";

interface IPriceProp {
  coinId: string;
}

const Price = ({ coinId }: IPriceProp) => {
  const isDarkTheme = useRecoilValue(isDarkAtom);
  const { isLoading, data: history } = useQuery<IHistorical[]>(
    ["price", coinId],
    () => fetchCoinHistory(coinId, 1),
    {
      refetchInterval: 10000,
    }
  );

  return (
    <div>
      {isLoading ? (
        "Loading..."
      ) : (
        <ApexChart
          options={{
            theme: {
              mode: isDarkTheme ? "dark" : "light",
            },
            chart: {
              type: "line",
              height: 500,
              width: 500,

              background: "transparent",
              dropShadow: {
                enabled: true,
                color: "#000",
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2,
              },
              toolbar: {
                show: false,
              },
            },
            colors: ["#77B6EA", "#545454"],
            stroke: {
              curve: "smooth",
            },
            title: {
              text: "High, Low Price of Coin",
              align: "left",
            },
            grid: {
              borderColor: "#e7e7e7",
              row: {
                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.5,
              },
            },
            xaxis: {
              decimalsInFloat: 1,
              type: "datetime",
              categories: history?.map((price) => price.time_close),
            },
            yaxis: {
              title: {
                text: "Price",
              },
              decimalsInFloat: 1,
            },
            legend: {
              position: "top",
              horizontalAlign: "right",
              floating: true,
              offsetY: -25,
              offsetX: -5,
            },
          }}
          series={[
            {
              name: "High Price",
              data: history?.map((price) => price.high) ?? [],
            },
            {
              name: "Low Price",
              data: history?.map((price) => price.low) ?? [],
            },
          ]}
        />
      )}
    </div>
  );
};

export default Price;
