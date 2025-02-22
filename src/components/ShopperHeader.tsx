
import { Store, History, Ticket, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";

export const ShopperHeader = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { icon: Store, label: "Stores", path: "/shopper" },
    { icon: Ticket, label: "Points", path: "/shopper/points" },
    { icon: History, label: "History", path: "/shopper/history" },
  ];

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <header className="bg-surface shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? "text-secondary font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            {user ? (
              <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-medium">
                {getInitials(user.name)}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-secondary text-white hover:bg-secondary/90">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
