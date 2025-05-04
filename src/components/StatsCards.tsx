
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { GitHubStats, generateEmbedMarkdown, generateEmbedHTML, languageColors } from "@/utils/statsCardUtils";
import { Progress } from "@/components/ui/progress";

// Basic stats card component (stars, commits, PRs, issues)
export const BasicStatsCard = ({ stats, username }: { stats: GitHubStats, username: string }) => {
  const [copied, setCopied] = useState(false);

  const copyMarkdown = () => {
    const markdown = generateEmbedMarkdown(username, 'basic');
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    toast.success("Markdown copied to clipboard");
    setTimeout(() => setCopied(false), 3000);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>Basic GitHub Stats</span>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={copyMarkdown}
            className="h-8 px-2"
          >
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </CardTitle>
        <CardDescription>
          Stars, commits, PRs and issues
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Total Stars</span>
            <span className="font-semibold">{stats.totalStars.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Total Commits</span>
            <span className="font-semibold">{stats.totalCommits.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Total PRs</span>
            <span className="font-semibold">{stats.totalPRs.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Total Issues</span>
            <span className="font-semibold">{stats.totalIssues.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Contributions (Last Year)</span>
            <span className="font-semibold">{stats.contributionsLastYear.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/40 text-xs text-muted-foreground">
        <p>Embed this card in your GitHub README</p>
      </CardFooter>
    </Card>
  );
};

// Language stats card component
export const LanguageStatsCard = ({ stats, username }: { stats: GitHubStats, username: string }) => {
  const [copied, setCopied] = useState(false);

  const copyMarkdown = () => {
    const markdown = generateEmbedMarkdown(username, 'languages');
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    toast.success("Markdown copied to clipboard");
    setTimeout(() => setCopied(false), 3000);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>Language Distribution</span>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={copyMarkdown}
            className="h-8 px-2"
          >
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </CardTitle>
        <CardDescription>
          Most used programming languages
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {stats.mostUsedLanguages.map((lang, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{lang.name}</span>
                <span>{lang.percentage}%</span>
              </div>
              <Progress 
                value={lang.percentage} 
                className="h-2" 
                style={{ 
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '--progress-color': lang.color
                } as React.CSSProperties}
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/40 text-xs text-muted-foreground">
        <p>Embed this card in your GitHub README</p>
      </CardFooter>
    </Card>
  );
};

// Streak stats card component
export const StreakStatsCard = ({ stats, username }: { stats: GitHubStats, username: string }) => {
  const [copied, setCopied] = useState(false);

  const copyMarkdown = () => {
    const markdown = generateEmbedMarkdown(username, 'streak');
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    toast.success("Markdown copied to clipboard");
    setTimeout(() => setCopied(false), 3000);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>Contribution Streak</span>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={copyMarkdown}
            className="h-8 px-2"
          >
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </CardTitle>
        <CardDescription>
          GitHub contribution statistics
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Current Streak</span>
            <span className="font-semibold">{stats.currentStreak.count} days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Longest Streak</span>
            <span className="font-semibold">{stats.longestStreak.count} days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Total Contributions</span>
            <span className="font-semibold">{stats.totalContributions.toLocaleString()}</span>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-muted-foreground mb-2">Longest streak</div>
            <div className="text-sm">
              {stats.longestStreak.start} - {stats.longestStreak.end}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/40 text-xs text-muted-foreground">
        <p>Embed this card in your GitHub README</p>
      </CardFooter>
    </Card>
  );
};
