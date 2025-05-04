
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import SearchBar from "@/components/SearchBar";
import UserProfileCard from "@/components/UserProfileCard";
import StatsCharts from "@/components/StatsCharts";
import { ProfileSkeleton, ChartSkeleton } from "@/components/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  fetchUserProfile, 
  fetchUserRepos, 
  fetchUserEvents,
  GitHubUser,
  GitHubRepo,
  GitHubEvent
} from "@/utils/fetchGithubData";

const Index = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [events, setEvents] = useState<GitHubEvent[]>([]);

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
            <h1 className="text-4xl font-bold mb-2">GitHub Insight Explorer</h1>
            <p className="text-muted-foreground">
              Analyze GitHub profiles with detailed stats and visualizations
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/stats-cards">Stats Cards</Link>
            </Button>
            <ThemeToggle />
          </div>
        </header>
        
        <div className="flex justify-center mb-12">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
        
        {!user && !isLoading && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">
              Welcome to GitHub Insight Explorer
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Enter a GitHub username to view detailed statistics, repository analytics,
              and contribution patterns. Discover the coding journey with beautiful charts.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link to="/stats-cards">Create GitHub Stats Cards</Link>
              </Button>
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="space-y-8">
            <ProfileSkeleton />
            <div className="grid md:grid-cols-2 gap-6">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
          </div>
        )}
        
        {user && !isLoading && (
          <div className="space-y-8">
            <UserProfileCard user={user} />
            
            <StatsCharts repos={repos} events={events} />
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

export default Index;
