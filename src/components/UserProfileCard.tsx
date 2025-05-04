
import { GitHubUser } from "@/utils/fetchGithubData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPin, Users, BookOpen, Link2 } from "lucide-react";

interface UserProfileCardProps {
  user: GitHubUser;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  const joinedDate = new Date(user.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="github-card overflow-hidden">
      <CardHeader className="flex flex-col md:flex-row md:items-center gap-4 pb-2">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 rounded-full">
          <AvatarImage src={user.avatar_url} alt={user.login} />
          <AvatarFallback>{user.login.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{user.name || user.login}</h2>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @{user.login}
            </a>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="flex items-center gap-1 py-1">
              <CalendarIcon className="h-3 w-3" />
              Joined {joinedDate}
            </Badge>
            {user.location && (
              <Badge variant="outline" className="flex items-center gap-1 py-1">
                <MapPin className="h-3 w-3" />
                {user.location}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {user.bio && <p className="text-muted-foreground mb-4">{user.bio}</p>}
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
            <Users className="h-5 w-5 text-primary mb-1" />
            <span className="text-lg font-semibold">{user.followers.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">Followers</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
            <Users className="h-5 w-5 text-primary mb-1" />
            <span className="text-lg font-semibold">{user.following.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">Following</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
            <BookOpen className="h-5 w-5 text-primary mb-1" />
            <span className="text-lg font-semibold">{user.public_repos.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">Repositories</span>
          </div>
        </div>
        
        {user.blog && (
          <div className="mt-4 flex items-center">
            <Link2 className="h-4 w-4 mr-2 text-muted-foreground" />
            <a
              href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              {user.blog}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
