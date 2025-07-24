"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const colorMap = {
  "Point direct": "#f0b100",
  "Faute provoquée": "#c10007",
  "Maladresse adverse": "#8200db",
  "Coup de chance": "#432dd7",
};

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
      color: colorMap[type] || "#ffba00",
    }));
  };

  const prepareGroupedData = (playerStats) => {
    const map = {};

    Object.values(playerStats.stats).forEach((p) => {
      const menu = p.itemMenu || "Autre";
      const sub = p.itemSubmenu || "Inconnu";

      if (!map[sub]) map[sub] = {};
      map[sub][menu] = (map[sub][menu] || 0) + 1;
    });

    const categories = [
      ...new Set(
        Object.values(playerStats.stats).map((p) => p.itemMenu || "Autre")
      ),
    ];

    const series = Object.entries(map).map(([submenu, counts]) => ({
      name: submenu,
      data: categories.map((menu) => counts[menu] || 0),
    }));

    return { categories, series };
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
        name: "Nbre de points",
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
        name: "Nbre de points",
        colorByPoint: true,
        data: formatData(stats.joueurB),
      },
    ],
  };

  const groupedDataA = prepareGroupedData(stats.joueurA);
  const groupedDataB = prepareGroupedData(stats.joueurB);

  const barOptionsA = {
    chart: {
      type: "column",
    },
    title: {
      text: `Répartition détaillée - ${stats.joueurA.nom}`,
    },
    xAxis: {
      categories: groupedDataA.categories,
      title: { text: "Type de point (1er niveau)" },
    },
    yAxis: {
      min: 0,
      title: { text: "Nombre de coups" },
      stackLabels: {
        enabled: true,
      },
    },
    legend: {
      reversed: false,
    },
    plotOptions: {
      column: {
        stacking: "normal",
      },
    },
    credits: {
      enabled: false,
    },
    series: groupedDataA.series,
  };

  const barOptionsB = {
    ...barOptionsA,
    title: { text: `Répartition détaillée - ${stats.joueurB.nom}` },
    xAxis: {
      categories: groupedDataB.categories,
      title: { text: "Type de point (1er niveau)" },
    },
    series: groupedDataB.series,
  };

return (
  <div className="flex flex-col gap-8 mt-8 w-full px-4">
    {/* Joueur A */}
    <div className="flex flex-row gap-4 w-full">
      <div className="w-1/3">
        <HighchartsReact highcharts={Highcharts} options={optionsA} />
      </div>
      <div className="w-2/3">
        <HighchartsReact highcharts={Highcharts} options={barOptionsA} />
      </div>
    </div>

    {/* Joueur B */}
    <div className="flex flex-row gap-4 w-full">
      <div className="w-1/3">
        <HighchartsReact highcharts={Highcharts} options={optionsB} />
      </div>
      <div className="w-2/3">
        <HighchartsReact highcharts={Highcharts} options={barOptionsB} />
      </div>
    </div>
  </div>
);

}
