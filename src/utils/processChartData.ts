
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

// Process events to get contribution activity over time
export function getContributionActivity(events: GitHubEvent[], months: number = 6) {
  // Calculate the date range: from 6 months ago to today
  const today = new Date();
  
  // Set the end date to the current date
  const endDate = new Date(today);
  
  // Set the start date to 6 months ago (from the beginning of that month)
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - (months - 1));
  startDate.setDate(1); // Start from the first day of the month
  startDate.setHours(0, 0, 0, 0); // Start from midnight
  
  // Create a map of months to count contributions
  const monthData: Map<string, {label: string, count: number}> = new Map();
  
  // Initialize all months with zero contributions
  for (let i = 0; i < months; i++) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(startDate.getMonth() + i);
    
    // Format: YYYY-MM for sorting
    const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    // Format: MMM YY for display (e.g. Jan 25)
    const monthLabel = currentDate.toLocaleString('default', { month: 'short', year: '2-digit' });
    
    monthData.set(monthKey, {label: monthLabel, count: 0});
  }
  
  // Count actual contributions
  if (events && events.length > 0) {
    // Filter events by type to only include actual contributions
    const contributionEventTypes = [
      'PushEvent', 
      'PullRequestEvent', 
      'IssuesEvent', 
      'CommitCommentEvent',
      'CreateEvent', // For repository or branch creation
      'PullRequestReviewEvent',
      'PullRequestReviewCommentEvent',
    ];
    
    const contributionEvents = events.filter(event => 
      contributionEventTypes.includes(event.type)
    );
    
    // Count contributions per month
    contributionEvents.forEach(event => {
      const eventDate = new Date(event.created_at);
      
      // Only include events within our target date range
      if (eventDate >= startDate && eventDate <= endDate) {
        const monthKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (monthData.has(monthKey)) {
          const monthInfo = monthData.get(monthKey)!;
          monthData.set(monthKey, {
            ...monthInfo,
            count: monthInfo.count + 1
          });
        }
      }
    });
  }
  
  // Convert the map to arrays for the chart
  const sortedKeys = Array.from(monthData.keys()).sort();
  const labels = sortedKeys.map(key => monthData.get(key)!.label);
  const contributionCounts = sortedKeys.map(key => monthData.get(key)!.count);
  
  console.log("Month labels:", labels);
  console.log("Contribution counts:", contributionCounts);
  
  return {
    labels: labels,
    datasets: [
      {
        label: "Contributions",
        data: contributionCounts,
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };
}
