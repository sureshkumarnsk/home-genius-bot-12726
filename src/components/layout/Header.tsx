import { Bell, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title?: string;
  showAvatar?: boolean;
  showNotifications?: boolean;
}

export const Header = ({ title, showAvatar = true, showNotifications = true }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          {showAvatar && (
            <Avatar className="w-10 h-10 cursor-pointer" onClick={() => navigate("/profile")}>
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          )}
          {title && <h1 className="text-xl font-semibold">{title}</h1>}
        </div>

        {showNotifications && (
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          </Button>
        )}
      </div>
    </header>
  );
};
