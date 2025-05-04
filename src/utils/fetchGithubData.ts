
import { toast } from "sonner";

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  location: string;
  created_at: string;
  updated_at: string;
  company?: string;
  blog?: string;
  twitter_username?: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  topics: string[];
  visibility: string;
  default_branch: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    id: number;
    login: string;
    display_login: string;
    gravatar_id: string;
    url: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: any;
  public: boolean;
  created_at: string;
}

export async function fetchUserProfile(username: string): Promise<GitHubUser | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        toast.error("User not found. Please check the username.");
      } else if (response.status === 403) {
        toast.error("API rate limit exceeded. Please try again later.");
      } else {
        toast.error(`Error: ${response.status} ${response.statusText}`);
      }
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    toast.error("Failed to fetch user profile. Please try again.");
    return null;
  }
}

export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  try {
    // Fetch up to 100 repositories sorted by stars
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        toast.error("User repositories not found.");
      } else if (response.status === 403) {
        toast.error("API rate limit exceeded. Please try again later.");
      } else {
        toast.error(`Error: ${response.status} ${response.statusText}`);
      }
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching user repositories:", error);
    toast.error("Failed to fetch user repositories. Please try again.");
    return [];
  }
}

export async function fetchUserEvents(username: string): Promise<GitHubEvent[]> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=100`
    );
    
    if (!response.ok) {
      if (response.status !== 404) {
        console.error(`Error fetching events: ${response.status} ${response.statusText}`);
      }
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching user events:", error);
    return [];
  }
}
