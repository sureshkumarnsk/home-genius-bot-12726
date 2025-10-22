import { Badge } from "@/components/ui/badge";
import { ShoppingBasket } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const GreetingBanner = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || "User";
  const itemCount = 12;

  return (
    <div className="p-6 bg-gradient-to-br from-primary to-primary-dark rounded-xl text-primary-foreground mb-4 animate-fade-in">
      <h2 className="text-2xl font-bold mb-2">Hi {userName} 👋</h2>
      <div className="flex items-center gap-2">
        <ShoppingBasket className="w-5 h-5" />
        <span className="text-lg">You have {itemCount} items in your list</span>
      </div>
      <Badge className="mt-3 bg-white/20 hover:bg-white/30 text-white border-white/30">
        Ready to compare prices
      </Badge>
    </div>
  );
};
