import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockItems = [
  { id: 1, name: "Milk (1L)", checked: false },
  { id: 2, name: "Bread (Brown)", checked: false },
  { id: 3, name: "Eggs (12 pcs)", checked: false },
];

export const CurrentListCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="hover-lift animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Current List</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary-dark"
          onClick={() => navigate("/list")}
        >
          See all (12)
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
