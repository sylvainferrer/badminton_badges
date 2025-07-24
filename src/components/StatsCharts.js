"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function StatsCharts({ stats }) {
  const formatData = (playerStats) => {
    const countByType = {};

    Object.values(playerStats.stats).forEach((p) => {
      const key = p.itemMenu || "Autre";
      countByType[key] = (countByType[key] || 0) + 1;
    });

    return Object.entries(countByType).map(([type, count]) => ({
      name: type,
      y: count,
    }));
  };

  const optionsA = {
    credits: {
      enabled: false,
    },
    chart: {
      type: "pie",
    },
    title: {
      text: stats.joueurA.nom,
    },
    series: [
      {
        name: "Types de points",
        colorByPoint: true,
        data: formatData(stats.joueurA),
      },
    ],
  };

  const optionsB = {
    credits: {
      enabled: false,
    },
    chart: {
      type: "pie",
    },
    title: {
      text: stats.joueurB.nom,
    },
    series: [
      {
        name: "Types de points",
        colorByPoint: true,
        data: formatData(stats.joueurB),
      },
    ],
  };

  return (
    <div className="flex justify-center gap-4 mt-8 w-full overflow-x-auto">
      <div className="min-w-[400px] max-w-[600px] flex-1">
        <HighchartsReact highcharts={Highcharts} options={optionsA} />
      </div>
      <div className="min-w-[400px] max-w-[600px] flex-1">
        <HighchartsReact highcharts={Highcharts} options={optionsB} />
      </div>
    </div>
  );

}
