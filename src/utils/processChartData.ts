
import { GitHubRepo } from "./fetchGithubData";

// Color palette for charts
export const chartColors = {
  light: [
    "rgba(54, 162, 235, 0.8)", // Blue
    "rgba(75, 192, 192, 0.8)", // Teal
    "rgba(153, 102, 255, 0.8)", // Purple
    "rgba(255, 159, 64, 0.8)", // Orange
    "rgba(255, 99, 132, 0.8)", // Red
    "rgba(255, 205, 86, 0.8)", // Yellow
    "rgba(201, 203, 207, 0.8)", // Grey
    "rgba(43, 205, 114, 0.8)", // Green
  ],
  dark: [
    "rgba(54, 162, 235, 1)", // Blue
    "rgba(75, 192, 192, 1)", // Teal
    "rgba(153, 102, 255, 1)", // Purple
    "rgba(255, 159, 64, 1)", // Orange
    "rgba(255, 99, 132, 1)", // Red
    "rgba(255, 205, 86, 1)", // Yellow
    "rgba(201, 203, 207, 1)", // Grey
    "rgba(43, 205, 114, 1)", // Green
  ]
};

// Get language distribution data
export function getLanguageDistribution(repos: GitHubRepo[]) {
  const languages = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Sort languages by count
  const sortedLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // If there are more than 8 languages, group the rest as "Others"
  const otherLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(8)
    .reduce((sum, [_, count]) => sum + count, 0);

  if (otherLanguages > 0) {
    sortedLanguages.push(["Others", otherLanguages]);
  }

  return {
    labels: sortedLanguages.map(([language]) => language),
    datasets: [
      {
        data: sortedLanguages.map(([_, count]) => count),
        backgroundColor: chartColors.light.slice(0, sortedLanguages.length),
        hoverBackgroundColor: chartColors.dark.slice(0, sortedLanguages.length),
        borderWidth: 1,
      },
    ],
  };
}

// Get top repositories by stars
export function getTopRepositories(repos: GitHubRepo[], limit: number = 10) {
  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, limit);

  return {
    labels: topRepos.map((repo) => repo.name),
    datasets: [
      {
        label: "Stars",
        data: topRepos.map((repo) => repo.stargazers_count),
        backgroundColor: chartColors.light[0],
        hoverBackgroundColor: chartColors.dark[0],
        borderColor: chartColors.light[0],
        borderWidth: 1,
      },
      {
        label: "Forks",
        data: topRepos.map((repo) => repo.forks_count),
        backgroundColor: chartColors.light[1],
        hoverBackgroundColor: chartColors.dark[1],
        borderColor: chartColors.light[1],
        borderWidth: 1,
      },
    ],
  };
}
