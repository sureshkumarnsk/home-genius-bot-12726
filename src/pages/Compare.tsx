import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const vendors = ["Amazon", "Flipkart", "JioMart", "Blinkit"];

const mockComparison = [
  {
    id: 1,
    name: "Milk 1L",
    prices: { Amazon: 58, Flipkart: 52, JioMart: 55, Blinkit: 60 },
    bestVendor: "Flipkart",
  },
  {
    id: 2,
    name: "Bread",
    prices: { Amazon: 42, Flipkart: 45, JioMart: 43, Blinkit: 40 },
    bestVendor: "Blinkit",
  },
  {
    id: 3,
    name: "Eggs (12)",
    prices: { Amazon: 68, Flipkart: 65, JioMart: 70, Blinkit: 65 },
    bestVendor: "Flipkart",
  },
];

const vendorTotals = {
  Amazon: 482,
  Flipkart: 445,
  JioMart: 468,
  Blinkit: 455,
};

const Compare = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"optimal" | "single">("optimal");

  const optimalTotal = Math.min(...Object.values(vendorTotals));
  const savingsVsSingle = Math.max(...Object.values(vendorTotals)) - optimalTotal;

  return (
    <div className="min-h-screen bg-background-secondary pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 max-w-md mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/list")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Compare Prices</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={viewMode === "optimal" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setViewMode("optimal")}
          >
            Optimal Split
          </Button>
          <Button
            variant={viewMode === "single" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setViewMode("single")}
          >
            Single Vendor
          </Button>
        </div>

        {/* Comparison Table */}
        <div className="bg-card rounded-lg overflow-hidden border border-border mb-6">
          {/* Header */}
          <div className="grid grid-cols-5 gap-2 p-3 border-b border-border bg-muted/50">
            <div className="font-semibold text-xs">Item</div>
            {vendors.map((vendor) => (
              <div key={vendor} className="font-semibold text-xs text-center">
                {vendor.slice(0, 4)}
              </div>
            ))}
          </div>

          {/* Rows */}
          {mockComparison.map((item) => (
            <div key={item.id} className="grid grid-cols-5 gap-2 p-3 border-b border-border last:border-0">
              <div className="text-sm font-medium">{item.name}</div>
              {vendors.map((vendor) => {
                const price = item.prices[vendor as keyof typeof item.prices];
                const isBest = vendor === item.bestVendor;
                return (
                  <div
                    key={vendor}
                    className={cn(
                      "text-sm text-center font-medium",
                      isBest && "text-success flex items-center justify-center gap-0.5"
                    )}
                  >
                    ₹{price}
                    {isBest && <Star className="w-3 h-3 fill-current" />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <Card className="mb-6 border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Optimal Split Total</p>
                <p className="text-3xl font-bold text-primary">₹{optimalTotal}</p>
              </div>
              <Badge className="bg-success text-success-foreground">
                <TrendingDown className="w-3 h-3 mr-1" />
                Save ₹{savingsVsSingle}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-muted-foreground">vs Single Vendor:</p>
              {Object.entries(vendorTotals).map(([vendor, total]) => (
                <div key={vendor} className="flex justify-between text-sm">
                  <span>{vendor}</span>
                  <span className={total === optimalTotal ? "text-success font-semibold" : "text-muted-foreground"}>
                    ₹{total}
                  </span>
                </div>
              ))}
            </div>

            <Button className="w-full" size="lg" onClick={() => navigate("/checkout")}>
              Buy from Optimal Split
            </Button>
            <Button className="w-full mt-2" size="lg" variant="outline">
              Customize Split
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Compare;
