
import { GitHubRepo, GitHubEvent } from "./fetchGithubData";

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
    .reduce((sum, [_, count]) => sum + count, 0); // Fixed: Properly typed reduce function

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

// Get contribution data for the heatmap graph
export function getContributionData(events: GitHubEvent[]) {
  // Define activity levels and their colors (improved color scheme)
  const activityColors = [
    "#ebedf0", // Level 0 - No activity
    "#9be9a8", // Level 1 - Low activity
    "#40c463", // Level 2 - Medium activity
    "#30a14e", // Level 3 - High activity
    "#216e39"  // Level 4 - Very high activity
  ];

  // Calculate date range: last 6 months
  const today = new Date();
  const endDate = new Date(today);
  
  // Start date: 6 months ago
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - 6);
  startDate.setDate(1); // Start from the first day of that month
  
  // Create a map to store contributions by date
  const contributionsByDate: Map<string, number> = new Map();
  
  // Initialize all days in the range with 0 contributions
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateKey = formatDate(currentDate);
    contributionsByDate.set(dateKey, 0);
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Filter contribution events
  const contributionEventTypes = [
    'PushEvent', 
    'PullRequestEvent', 
    'IssuesEvent', 
    'CommitCommentEvent',
    'CreateEvent', 
    'PullRequestReviewEvent',
    'PullRequestReviewCommentEvent',
  ];
  
  // Count contributions per day
  if (events && events.length > 0) {
    const contributionEvents = events.filter(event => 
      contributionEventTypes.includes(event.type)
    );
    
    contributionEvents.forEach(event => {
      const eventDate = new Date(event.created_at);
      if (eventDate >= startDate && eventDate <= endDate) {
        const dateKey = formatDate(eventDate);
        if (contributionsByDate.has(dateKey)) {
          contributionsByDate.set(dateKey, contributionsByDate.get(dateKey)! + 1);
        }
      }
    });
  }
  
  // Find max contributions to normalize activity levels
  const allContributions = Array.from(contributionsByDate.values());
  const maxContributions = Math.max(...allContributions, 1); // Avoid division by zero
  
  // Adjust start date to begin from the Sunday of the week containing the start date
  const weekStartDate = new Date(startDate);
  weekStartDate.setDate(startDate.getDate() - startDate.getDay());
  
  // Group by weeks (starting from Sunday)
  const weeks: Array<{ date: string; count: number; level: number }[]> = [];
  
  // Fill in the data structure for the heatmap
  currentDate = new Date(weekStartDate);
  
  while (currentDate <= endDate) {
    const week: { date: string; count: number; level: number }[] = [];
    
    // Add days for this week (Sunday to Saturday)
    for (let i = 0; i < 7; i++) {
      if (currentDate <= endDate) {
        const dateKey = formatDate(currentDate);
        const count = contributionsByDate.get(dateKey) || 0;
        
        // Calculate activity level (0-4)
        let level = 0;
        if (count > 0) {
          // Normalize to levels 1-4 based on activity
          level = Math.min(Math.ceil((count / maxContributions) * 4), 4);
        }
        
        week.push({
          date: dateKey,
          count,
          level
        });
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (week.length > 0) {
      weeks.push(week);
    }
  }
  
  // Calculate month labels with more accurate positioning
  const months: { name: string; index: number }[] = [];
  let lastMonth = -1;
  
  // Go through each week and track when month changes
  for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
    const weekFirstDay = new Date(weeks[weekIndex][0].date);
    const month = weekFirstDay.getMonth();
    
    if (month !== lastMonth) {
      months.push({
        name: formatMonth(weekFirstDay),
        index: weekIndex  // Position is based on week index
      });
      lastMonth = month;
    }
  }
  
  return {
    weeks,
    months,
    colors: activityColors
  };
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to format month name
function formatMonth(date: Date): string {
  // Return abbreviated month name (Jan, Feb, etc.)
  return date.toLocaleString('default', { month: 'short' });
}
