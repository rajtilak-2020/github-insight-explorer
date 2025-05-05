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
    .reduce((sum, [count]) => sum + count, 0);

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
  // Define activity levels and their colors
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
    const dateKey = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
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
        const dateKey = eventDate.toISOString().split('T')[0];
        if (contributionsByDate.has(dateKey)) {
          contributionsByDate.set(dateKey, contributionsByDate.get(dateKey)! + 1);
        }
      }
    });
  }
  
  // Calculate weeks and days for the contribution graph
  const weeks: Array<{ date: string; count: number; level: number }[]> = [];
  
  // Group by weeks (starting from Sunday)
  let currentWeek: { date: string; count: number; level: number }[] = [];
  
  // Start from the first Sunday on or before the start date
  let weekStart = new Date(startDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  
  currentDate = new Date(weekStart);
  
  // Find max contributions to normalize activity levels
  const allContributions = Array.from(contributionsByDate.values());
  const maxContributions = Math.max(...allContributions, 1); // Avoid division by zero
  
  // Fill in the data structure for the heatmap
  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split('T')[0];
    const count = contributionsByDate.get(dateKey) || 0;
    
    // Calculate activity level (0-4)
    let level = 0;
    if (count > 0) {
      // Normalize to levels 1-4 based on activity
      level = Math.min(Math.ceil((count / maxContributions) * 4), 4);
    }
    
    currentWeek.push({
      date: dateKey,
      count,
      level
    });
    
    // If it's Saturday, start a new week
    if (currentDate.getDay() === 6) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Add the last partial week if it exists
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  // Month labels for the top of the graph
  const months: { name: string; index: number }[] = [];
  currentDate = new Date(startDate);
  
  let lastMonth = -1;
  while (currentDate <= endDate) {
    const month = currentDate.getMonth();
    
    // Add a new month when it changes
    if (month !== lastMonth) {
      months.push({
        name: currentDate.toLocaleString('default', { month: 'short' }),
        index: weeks.length > 0 ? calculateMonthPosition(currentDate, weeks) : 0
      });
      lastMonth = month;
    }
    
    // Move to next day (approximating a month as 30 days for positioning)
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  return {
    weeks,
    months,
    colors: activityColors
  };
}

// Helper function to calculate the position of a month label
function calculateMonthPosition(date: Date, weeks: any[]): number {
  // Get the first day of the month
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  
  // Calculate which week this falls into
  const weekIndex = Math.floor((firstDayOfMonth.getTime() - new Date(weeks[0][0].date).getTime()) / (7 * 24 * 60 * 60 * 1000));
  
  // Return the week index, clamping between 0 and the number of weeks
  return Math.max(0, Math.min(weekIndex, weeks.length - 1));
}
