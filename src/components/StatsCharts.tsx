
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
  getTopRepositories, 
  getContributionData 
} from "@/utils/processChartData";
import { GitHub } from "lucide-react";

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
  const contributionData = getContributionData(events);

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
  const hasEvents = events && events.length > 0;

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

      {hasEvents && (
        <Card className="github-card md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Contribution Graph (Last 6 Months)</CardTitle>
            <GitHub className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-auto w-full overflow-x-auto pb-4">
              <div className="contribution-graph">
                {/* Month labels */}
                <div className="flex mb-1 text-xs text-muted-foreground">
                  {contributionData.months.map((month, i) => (
                    <div
                      key={i}
                      className="flex-1 text-center"
                      style={{
                        position: 'relative',
                        left: `${(month.index / contributionData.weeks.length) * 100}%`
                      }}
                    >
                      {month.name}
                    </div>
                  ))}
                </div>
                
                {/* Day labels */}
                <div className="flex">
                  <div className="pr-2 text-xs flex flex-col justify-around h-[104px] text-muted-foreground">
                    <span>Sun</span>
                    <span>Tue</span>
                    <span>Thu</span>
                    <span>Sat</span>
                  </div>
                  
                  {/* Contribution cells */}
                  <div className="flex-1 flex">
                    {contributionData.weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-1">
                        {week.map((day, dayIndex) => (
                          <div
                            key={`${weekIndex}-${dayIndex}`}
                            className="w-3 h-3 rounded-sm"
                            style={{ 
                              backgroundColor: contributionData.colors[day.level],
                              cursor: 'pointer'
                            }}
                            title={`${day.date}: ${day.count} contributions`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Color scale */}
                <div className="flex items-center justify-end mt-2 text-xs text-muted-foreground">
                  <span className="mr-2">Less</span>
                  {contributionData.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-sm mx-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <span className="ml-2">More</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatsCharts;
