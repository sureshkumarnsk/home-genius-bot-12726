import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search, Plus, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const filterOptions = ["All", "Expiring Soon", "Low Stock"];

const mockInventory = [
  {
    id: 1,
    name: "Rice",
    packSize: "5kg",
    currentQty: "3kg",
    expiryDays: 2,
    status: "expiring",
  },
  {
    id: 2,
    name: "Dal",
    packSize: "1kg",
    currentQty: "500g",
    expiryDays: 15,
    status: "normal",
  },
  {
    id: 3,
    name: "Sugar",
    packSize: "2kg",
    currentQty: "1.5kg",
    expiryDays: 45,
    status: "normal",
  },
  {
    id: 4,
    name: "Cooking Oil",
    packSize: "1L",
    currentQty: "200ml",
    expiryDays: 30,
    status: "low",
  },
];

const Inventory = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 max-w-md mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/more")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Pantry Inventory</h1>
          <Button variant="ghost" size="icon">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search inventory..." className="pl-10" />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {filterOptions.map((filter) => (
            <Badge
              key={filter}
              variant={filter === "All" ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-4 py-2 whitespace-nowrap",
                filter === "All" && "bg-primary text-primary-foreground"
              )}
            >
              {filter}
            </Badge>
          ))}
        </div>

        {/* Inventory Items */}
        <div className="space-y-3">
          {mockInventory.map((item) => (
            <Card key={item.id} className="hover-lift">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.currentQty} of {item.packSize}
                    </p>
                    <div className="flex items-center gap-2">
                      {item.status === "expiring" && (
                        <Badge variant="outline" className="text-warning border-warning">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Expires in {item.expiryDays} days
                        </Badge>
                      )}
                      {item.status === "low" && (
                        <Badge variant="outline" className="text-error border-error">
                          Low Stock
                        </Badge>
                      )}
                      {item.status === "normal" && (
                        <Badge variant="outline">
                          {item.expiryDays} days left
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Inventory;
