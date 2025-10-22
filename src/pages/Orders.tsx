import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Package, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const statusColors = {
  delivered: "bg-success text-success-foreground",
  processing: "bg-warning text-warning-foreground",
  pending: "bg-secondary text-secondary-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
};

const mockOrders = [
  {
    id: "ORD-001",
    date: "Oct 20, 2025",
    vendors: ["Amazon", "Flipkart"],
    itemsCount: 8,
    total: 620,
    status: "delivered" as keyof typeof statusColors,
  },
  {
    id: "ORD-002",
    date: "Oct 15, 2025",
    vendors: ["JioMart"],
    itemsCount: 5,
    total: 340,
    status: "processing" as keyof typeof statusColors,
  },
  {
    id: "ORD-003",
    date: "Oct 10, 2025",
    vendors: ["Blinkit"],
    itemsCount: 3,
    total: 185,
    status: "delivered" as keyof typeof statusColors,
  },
];

const filterOptions = ["All", "Pending", "Delivered", "Auto-orders"];

const Orders = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-secondary pb-20">
      <Header title="Orders" showAvatar={false} />

      <main className="max-w-md mx-auto px-4 py-4">
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

        {/* Orders List */}
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <Card
              key={order.id}
              className="hover-lift cursor-pointer"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{order.date}</p>
                    <p className="font-semibold text-lg">Order #{order.id.slice(-3)}</p>
                  </div>
                  <Badge className={statusColors[order.status]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {order.vendors.join(" + ")}
                    {order.vendors.length > 1 && " (Split order)"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{order.itemsCount} items</p>
                    <p className="text-xl font-bold">₹{order.total}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Reorder
                    </Button>
                    <Button size="sm" variant="ghost">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {mockOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">
              Your order history will appear here
            </p>
            <Button onClick={() => navigate("/")}>Start Shopping</Button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Orders;
