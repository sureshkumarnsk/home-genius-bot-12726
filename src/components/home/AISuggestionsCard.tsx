import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockSuggestions = [
  { id: 1, name: "Rice (5kg)", daysUntilRunOut: 3 },
  { id: 2, name: "Dal (1kg)", daysUntilRunOut: 5 },
];

export const AISuggestionsCard = () => {
  return (
    <Card className="hover-lift animate-fade-in border-secondary/50" style={{ animationDelay: "0.2s" }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-secondary" />
          <CardTitle className="text-lg font-semibold">AI Suggestions</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          {mockSuggestions.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <span className="text-foreground">{item.name}</span>
              <Badge variant="secondary" className="text-xs">
                {item.daysUntilRunOut} days
              </Badge>
            </div>
          ))}
        </div>
        <Button className="w-full" variant="secondary">
          Add all to list
        </Button>
      </CardContent>
    </Card>
  );
};
