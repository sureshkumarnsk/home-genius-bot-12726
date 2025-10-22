import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Users,
  MapPin,
  Package,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const menuSections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Profile", path: "/profile" },
      { icon: Users, label: "Family Members", path: "/family", badge: "3" },
      { icon: MapPin, label: "Addresses", path: "/addresses", badge: "2" },
    ],
  },
  {
    title: "Features",
    items: [
      { icon: Package, label: "Inventory", path: "/inventory" },
      { icon: FileText, label: "Bills & Expenses", path: "/bills" },
    ],
  },
  {
    title: "Settings",
    items: [
      { icon: Settings, label: "App Settings", path: "/settings" },
      { icon: HelpCircle, label: "Help & Support", path: "/help" },
    ],
  },
];

const More = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-secondary pb-20">
      <Header title="More" showAvatar={false} />

      <main className="max-w-md mx-auto px-4 py-4">
        {/* User Card */}
        <Card className="mb-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">Priya Sharma</h3>
                <p className="text-sm text-muted-foreground">priya@example.com</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Menu Sections */}
        {menuSections.map((section) => (
          <div key={section.title} className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3 px-2">
              {section.title}
            </h2>
            <Card>
              <CardContent className="p-0">
                {section.items.map((item, index) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Logout Button */}
        <Card className="border-destructive/30">
          <CardContent className="p-0">
            <button className="w-full flex items-center justify-between p-4 hover:bg-destructive/10 transition-colors text-destructive">
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </div>
            </button>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default More;
