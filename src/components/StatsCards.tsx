
import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitHubStats } from "@/utils/statsCardUtils";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import { Copy } from "lucide-react";

interface StatsCardProps {
  stats: GitHubStats;
  username: string;
}

// Basic Stats Card
export const BasicStatsCard: React.FC<StatsCardProps> = ({ stats, username }) => {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleCopyMarkdown = () => {
    const markdown = `![${username}'s GitHub Stats](${window.location.origin}/api/stats/${username}/basic)`;
    navigator.clipboard.writeText(markdown)
      .then(() => toast.success("Markdown copied to clipboard"))
      .catch(() => toast.error("Failed to copy to clipboard"));
  };

  return (
    <Card className="github-card relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="text-github-purple dark:text-github-purple">{username}'s GitHub Stats</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCopyMarkdown}
            className="absolute top-2 right-2"
            title="Copy markdown for README"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={cardRef} 
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-black text-white' : 'bg-github-light text-black'}`}
          style={{ minHeight: "180px" }}
        >
          <h3 className="text-github-purple font-bold text-xl mb-4">{username}'s GitHub Stats</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="flex justify-between">
                <span className="text-white">Total Stars Earned:</span>
                <span className="font-semibold">{stats.totalStars}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-white">Total Commits:</span>
                <span className="font-semibold">{stats.totalCommits}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-white">Total PRs:</span>
                <span className="font-semibold">{stats.totalPRs}</span>
              </p>
            </div>
            
            <div>
              <p className="flex justify-between">
                <span className="text-white">Total Issues:</span>
                <span className="font-semibold">{stats.totalIssues}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-white">Contributed to (last year):</span>
                <span className="font-semibold">{stats.contributionsLastYear}</span>
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ 
                  background: stats.mostUsedLanguages[0]?.color || languageColors.default,
                  border: '3px solid rgba(255,255,255,0.2)'
                }}
            >
              <span className="text-white font-bold text-lg">
                {stats.mostUsedLanguages[0]?.name?.charAt(0) || "?"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Language Stats Card
export const LanguageStatsCard: React.FC<StatsCardProps> = ({ stats, username }) => {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleCopyMarkdown = () => {
    const markdown = `![${username}'s Language Stats](${window.location.origin}/api/stats/${username}/languages)`;
    navigator.clipboard.writeText(markdown)
      .then(() => toast.success("Markdown copied to clipboard"))
      .catch(() => toast.error("Failed to copy to clipboard"));
  };

  return (
    <Card className="github-card relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="text-github-purple dark:text-github-purple">Most Used Languages</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCopyMarkdown}
            className="absolute top-2 right-2"
            title="Copy markdown for README"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={cardRef}
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-black text-white' : 'bg-github-light text-black'}`}
          style={{ minHeight: "200px" }}
        >
          <h3 className="text-github-purple font-bold text-xl mb-4">Most Used Languages</h3>
          
          <div className="mb-4">
            <div className="flex h-4 mb-4 overflow-hidden">
              {stats.mostUsedLanguages.map((lang, index) => (
                <div 
                  key={index} 
                  style={{ 
                    width: `${lang.percentage}%`, 
                    backgroundColor: lang.color || languageColors.default 
                  }} 
                />
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {stats.mostUsedLanguages.map((lang, index) => (
                <div key={index} className="flex items-center mb-1">
                  <span 
                    className="h-3 w-3 rounded-full mr-2" 
                    style={{ backgroundColor: lang.color || languageColors.default }}
                  ></span>
                  <span className="text-sm text-white">{lang.name} {lang.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Streak Stats Card
export const StreakStatsCard: React.FC<StatsCardProps> = ({ stats, username }) => {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleCopyMarkdown = () => {
    const markdown = `![${username}'s Streak Stats](${window.location.origin}/api/stats/${username}/streak)`;
    navigator.clipboard.writeText(markdown)
      .then(() => toast.success("Markdown copied to clipboard"))
      .catch(() => toast.error("Failed to copy to clipboard"));
  };

  return (
    <Card className="github-card relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="text-github-purple dark:text-github-purple">GitHub Streak Stats</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCopyMarkdown}
            className="absolute top-2 right-2"
            title="Copy markdown for README"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={cardRef}
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-black text-white' : 'bg-github-light text-black'}`}
          style={{ minHeight: "180px" }}
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-github-purple text-3xl font-bold mb-1">
                {stats.totalContributions}
              </div>
              <div className="text-github-purple text-sm">Total Contributions</div>
              <div className="text-xs text-white mt-2">
                Nov 3, 2023 – Present
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 mb-1">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(127, 87, 221, 0.2)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#7F57DD"
                    strokeWidth="3"
                    strokeDasharray={`${stats.currentStreak.count * 3}, 100`}
                  />
                  <text
                    x="18"
                    y="20.5"
                    className="text-2xl font-bold"
                    textAnchor="middle"
                    fill="#7F57DD"
                  >
                    {stats.currentStreak.count}
                  </text>
                </svg>
              </div>
              <div className="text-github-purple text-sm">Current Streak</div>
              <div className="text-xs text-white mt-2">
                {stats.currentStreak.start} - {stats.currentStreak.end}
              </div>
            </div>
            
            <div>
              <div className="text-github-purple text-3xl font-bold mb-1">
                {stats.longestStreak.count}
              </div>
              <div className="text-github-purple text-sm">Longest Streak</div>
              <div className="text-xs text-white mt-2">
                {stats.longestStreak.start} - {stats.longestStreak.end}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
