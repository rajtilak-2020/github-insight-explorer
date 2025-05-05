
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { GitHubRepo, GitHubEvent } from "@/utils/fetchGithubData";
import { 
  getLanguageDistribution, 
  getTopRepositories
} from "@/utils/processChartData";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface StatsChartsProps {
  repos: GitHubRepo[];
  events: GitHubEvent[];
}

const StatsCharts: React.FC<StatsChartsProps> = ({ repos, events }) => {
  const languageData = getLanguageDistribution(repos);
  const topReposData = getTopRepositories(repos, 5);

  // Chart options
  const languageOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} repos (${percentage}%)`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
  };

  const hasRepos = repos && repos.length > 0;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {hasRepos && (
        <Card className="github-card md:col-span-1">
          <CardHeader>
            <CardTitle>Language Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="h-[300px] w-full">
              <Pie data={languageData} options={languageOptions} />
            </div>
          </CardContent>
        </Card>
      )}

      {hasRepos && (
        <Card className="github-card md:col-span-1">
          <CardHeader>
            <CardTitle>Top Repositories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <Bar data={topReposData} options={barOptions} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatsCharts;
