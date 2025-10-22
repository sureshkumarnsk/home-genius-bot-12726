import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { GreetingBanner } from "@/components/home/GreetingBanner";
import { CurrentListCard } from "@/components/home/CurrentListCard";
import { AISuggestionsCard } from "@/components/home/AISuggestionsCard";
import { ExpiringItemsCard } from "@/components/home/ExpiringItemsCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-secondary pb-20">
      <Header title="My Home" />
      
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        <GreetingBanner />
        <CurrentListCard />
        <AISuggestionsCard />
        <ExpiringItemsCard />
      </main>

      <Button
        size="lg"
        className="fixed bottom-20 right-4 z-40 rounded-full w-14 h-14 shadow-xl hover-scale"
        onClick={() => navigate("/list")}
      >
        <Plus className="w-6 h-6" />
      </Button>

      <BottomNav />
    </div>
  );
};

export default Home;
