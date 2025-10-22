import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Search, Mic, Camera, Trash2, Share } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const categories = ["All", "Vegetables", "Dairy", "Pantry", "Fruits", "Snacks"];

const mockItems = [
  { id: 1, name: "Milk 1L", category: "Dairy", quantity: "1L", priceRange: "₹52-68", checked: false },
  { id: 2, name: "Bread (Brown)", category: "Pantry", quantity: "1 pack", priceRange: "₹38-45", checked: false },
  { id: 3, name: "Tomatoes", category: "Vegetables", quantity: "1kg", priceRange: "₹25-40", checked: false },
  { id: 4, name: "Eggs", category: "Dairy", quantity: "12 pcs", priceRange: "₹65-75", checked: false },
  { id: 5, name: "Rice (Basmati)", category: "Pantry", quantity: "5kg", priceRange: "₹450-550", checked: false },
  { id: 6, name: "Onions", category: "Vegetables", quantity: "1kg", priceRange: "₹30-45", checked: false },
  { id: 7, name: "Yogurt", category: "Dairy", quantity: "500g", priceRange: "₹45-55", checked: false },
  { id: 8, name: "Bananas", category: "Fruits", quantity: "1 dozen", priceRange: "₹40-55", checked: false },
];

const GroceryList = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = mockItems.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 max-w-md mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Weekly List</h1>
          <Button variant="ghost" size="icon">
            <Share className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-10 pr-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            <Mic className="w-5 h-5 text-primary" />
          </Button>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-4 py-2 whitespace-nowrap",
                selectedCategory === category
                  ? "bg-primary text-primary-foreground hover:bg-primary-dark"
                  : "hover:bg-muted"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Items List */}
        <div className="space-y-3 mb-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <Checkbox className="mt-1" />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.quantity}</p>
                <p className="text-sm text-primary font-medium mt-1">{item.priceRange}</p>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Quick Add Buttons */}
        <div className="fixed bottom-32 right-4 flex flex-col gap-3 z-40">
          <Button size="icon" className="rounded-full w-12 h-12 bg-secondary hover:bg-secondary-dark shadow-lg">
            <Camera className="w-5 h-5" />
          </Button>
          <Button size="icon" className="rounded-full w-12 h-12 bg-primary hover:bg-primary-dark shadow-lg">
            <Mic className="w-5 h-5" />
          </Button>
        </div>
      </main>

      {/* Bottom Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total items</p>
            <p className="text-xl font-bold">{mockItems.length}</p>
          </div>
          <Button size="lg" onClick={() => navigate("/compare")}>
            Compare Prices
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default GroceryList;
