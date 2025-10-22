import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const mockExpiringItems = [
  { id: 1, name: "Yogurt", daysLeft: 2 },
];

export const ExpiringItemsCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="hover-lift animate-fade-in border-warning/50" style={{ animationDelay: "0.3s" }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <CardTitle className="text-lg font-semibold">Expiring Soon</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-warning hover:text-warning-dark"
          onClick={() => navigate("/inventory")}
        >
          View all
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        {mockExpiringItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <span className="text-foreground">{item.name}</span>
            <Badge variant="outline" className="text-warning border-warning">
              {item.daysLeft} days left
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
