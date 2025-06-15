import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  plugins,
  scales,
} from "chart.js";
import { getLast7Days } from "../../lib/features";
 import { purple, sunsetGradient, violet } from "../constants/color";

const labels = getLast7Days();

ChartJS.register(
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend
);

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

export const LineChart = ({ value = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Sample Data",
        data: value,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };
  return <Line data={data} options={lineChartOptions} />;
};

const DoughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  
  },
  cutout: "120",
};

export const DoughnutChart = ({ value = [], chartLabels = [] }) => {
  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: "Total Chats Vs Group Chats",
        data: value,
        borderColor: "rgb(0, 153, 153)",
        backgroundColor: [violet, sunsetGradient],
        hoverBackgroundColor: [purple],
        offset: 30, 
      },
    ],
  };

  return <Doughnut style={{zIndex: 10}} data={data} options={DoughnutChartOptions} />;
};
