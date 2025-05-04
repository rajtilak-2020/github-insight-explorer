
import { GitHubUser, GitHubRepo, GitHubEvent } from "./fetchGithubData";

export interface GitHubStats {
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  contributionsLastYear: number;
  currentStreak: {
    count: number;
    start: string;
    end: string;
  };
  longestStreak: {
    count: number;
    start: string;
    end: string;
  };
  totalContributions: number;
  mostUsedLanguages: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
}

// Language colors from GitHub
export const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  Java: "#b07219",
  Ruby: "#701516",
  PHP: "#4F5D95",
  "C#": "#178600",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  Rust: "#dea584",
  Dart: "#00B4AB",
  Shell: "#89e051",
  "Jupyter Notebook": "#DA5B0B",
  Batchfile: "#C1F12E",
  default: "#8E9196"
};

export const calculateGitHubStats = (
  user: GitHubUser,
  repos: GitHubRepo[],
  events: GitHubEvent[]
): GitHubStats => {
  // Calculate total stars
  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

  // Count PRs, Issues, and Commits from events
  let totalPRs = 0;
  let totalIssues = 0;
  let totalCommits = 0;

  events.forEach(event => {
    if (event.type === "PullRequestEvent") {
      totalPRs++;
    } else if (event.type === "IssuesEvent") {
      totalIssues++;
    } else if (event.type === "PushEvent" && event.payload.commits) {
      totalCommits += event.payload.commits.length;
    }
  });

  // Calculate contributions last year (simplified)
  // In a real app, you'd use GitHub's GraphQL API to get accurate contribution data
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const contributionsLastYear = events.filter(
    event => new Date(event.created_at) > oneYearAgo
  ).length;

  // Calculate streaks (simplified example)
  // This is a placeholder implementation - real calculation would require GraphQL API
  const currentStreak = {
    count: 4, // Example value
    start: new Date().toLocaleDateString(),
    end: new Date().toLocaleDateString(),
  };

  const longestStreak = {
    count: 33, // Example value
    start: "Jan 13",
    end: "Feb 14",
  };

  // Calculate total contributions (placeholder)
  const totalContributions = 466; // Example value

  // Calculate most used languages
  const languagesMap = new Map<string, number>();
  
  repos.forEach(repo => {
    if (repo.language) {
      const currentCount = languagesMap.get(repo.language) || 0;
      languagesMap.set(repo.language, currentCount + 1);
    }
  });

  const totalReposWithLanguage = [...languagesMap.values()].reduce((a, b) => a + b, 0);
  
  const mostUsedLanguages = [...languagesMap.entries()]
    .map(([name, count]) => ({
      name,
      percentage: parseFloat(((count / totalReposWithLanguage) * 100).toFixed(2)),
      color: languageColors[name] || languageColors.default,
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 6); // Get top 6 languages

  return {
    totalStars,
    totalCommits,
    totalPRs,
    totalIssues,
    contributionsLastYear,
    currentStreak,
    longestStreak,
    totalContributions,
    mostUsedLanguages,
  };
};

// Generate embeddable markdown for GitHub README
export const generateEmbedMarkdown = (username: string, cardType: string): string => {
  const baseUrl = window.location.origin;
  return `![${username}'s GitHub Stats](${baseUrl}/api/stats/${username}/${cardType})`;
};

// Generate embeddable HTML for websites
export const generateEmbedHTML = (username: string, cardType: string): string => {
  const baseUrl = window.location.origin;
  return `<img src="${baseUrl}/api/stats/${username}/${cardType}" alt="${username}'s GitHub Stats" />`;
};
