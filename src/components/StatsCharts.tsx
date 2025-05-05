
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const languageData = getLanguageDistribution(repos);
  const topReposData = getTopRepositories(repos, isMobile ? 3 : 5);

  // Chart options
  const languageOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
          padding: isMobile ? 10 : 20,
          font: {
            size: isMobile ? 10 : 12,
          },
        },
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
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: isMobile ? 9 : 11,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 12,
          padding: isMobile ? 10 : 20,
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
      title: {
        display: false,
      },
    },
  };

  const hasRepos = repos && repos.length > 0;
  const chartHeight = isMobile ? "240px" : "300px";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {hasRepos && (
        <Card className="github-card col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg md:text-xl">Language Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <div className="h-[240px] md:h-[300px] w-full">
              <Pie data={languageData} options={languageOptions} />
            </div>
          </CardContent>
        </Card>
      )}

      {hasRepos && (
        <Card className="github-card col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg md:text-xl">Top Repositories</CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <ScrollArea className="h-[240px] md:h-[300px] w-full">
              <div className="min-h-[240px] md:min-h-[300px] min-w-[300px]">
                <Bar data={topReposData} options={barOptions} />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatsCharts;
