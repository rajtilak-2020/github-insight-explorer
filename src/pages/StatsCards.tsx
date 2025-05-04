
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import SearchBar from "@/components/SearchBar";
import { BasicStatsCard, LanguageStatsCard, StreakStatsCard } from "@/components/StatsCards";
import { ProfileSkeleton } from "@/components/SkeletonLoader";
import { calculateGitHubStats, GitHubStats } from "@/utils/statsCardUtils";
import { toast } from "sonner";
import { 
  fetchUserProfile, 
  fetchUserRepos, 
  fetchUserEvents,
  GitHubUser,
  GitHubRepo,
  GitHubEvent
} from "@/utils/fetchGithubData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StatsCardsPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const { theme } = useTheme();

  const handleSearch = async (username: string) => {
    setIsLoading(true);
    
    try {
      // Fetch user profile
      const userData = await fetchUserProfile(username);
      if (!userData) {
        setIsLoading(false);
        return;
      }
      
      setUser(userData);
      
      // Fetch repositories and events in parallel
      const [reposData, eventsData] = await Promise.all([
        fetchUserRepos(username),
        fetchUserEvents(username)
      ]);
      
      setRepos(reposData);
      setEvents(eventsData);
      
      // Calculate stats
      const calculatedStats = calculateGitHubStats(userData, reposData, eventsData);
      setStats(calculatedStats);
      
      if (reposData.length === 0 && userData) {
        toast.warning("No repositories found for this user.");
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">GitHub Stats Cards</h1>
            <p className="text-muted-foreground">
              Generate embeddable GitHub stats cards for your README profile
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>
        
        <div className="flex justify-center mb-12">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
        
        {!user && !isLoading && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>How to Use GitHub Stats Cards</CardTitle>
              <CardDescription>
                Generate visually appealing GitHub statistics cards for your profile README
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3">
                <li>Enter a GitHub username in the search box above</li>
                <li>View the generated stats cards</li>
                <li>Click the copy button on any card to get embeddable markdown for your GitHub README</li>
                <li>Paste the markdown into your README.md file</li>
              </ol>
              
              <div className="mt-6 p-4 bg-muted rounded-md">
                <p className="font-mono text-sm">
                  ![username's GitHub Stats](https://your-app-url.com/api/stats/username/basic)
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {isLoading && (
          <div className="space-y-8">
            <ProfileSkeleton />
            <ProfileSkeleton />
            <ProfileSkeleton />
          </div>
        )}
        
        {user && stats && !isLoading && (
          <div className="space-y-8">
            <Tabs defaultValue="cards" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="cards">Stats Cards</TabsTrigger>
                <TabsTrigger value="info">How to Use</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cards">
                <div className="grid md:grid-cols-2 gap-8">
                  <BasicStatsCard stats={stats} username={user.login} />
                  <LanguageStatsCard stats={stats} username={user.login} />
                  <StreakStatsCard stats={stats} username={user.login} />
                </div>
              </TabsContent>
              
              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <CardTitle>Using GitHub Stats Cards</CardTitle>
                    <CardDescription>
                      Follow these steps to add the stats cards to your GitHub README
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Choose the stats card you want to use</li>
                          <li>Click the copy button on the card to copy the markdown</li>
                          <li>Paste the markdown in your GitHub README.md file</li>
                        </ol>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Available Cards</h3>
                        <ul className="list-disc list-inside space-y-2">
                          <li><strong>Basic Stats:</strong> Shows total stars, commits, PRs, and issues</li>
                          <li><strong>Language Stats:</strong> Displays most used programming languages</li>
                          <li><strong>Streak Stats:</strong> Shows contribution streaks and total contributions</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Example Markdown</h3>
                        <div className="p-3 bg-muted rounded-md font-mono text-sm">
                          {`![${user.login}'s GitHub Stats](${window.location.origin}/api/stats/${user.login}/basic)`}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        <footer className="mt-20 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} GitHub Insight Explorer</p>
          <p className="mt-1">
            Powered by the 
            <a 
              href="https://docs.github.com/en/rest" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline mx-1"
            >
              GitHub API
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default StatsCardsPage;
