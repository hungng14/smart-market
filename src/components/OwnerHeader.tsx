
import { Store, History, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "./ui/avatar";

export const OwnerHeader = () => {
  const ownerData = JSON.parse(localStorage.getItem("ownerData") || "{}");

  const getInitials = (name?: string) => {
    if (!name) return "";
    const parts = name.split(" ");
    return parts.map(part => part[0]?.toUpperCase() || "").join("");
  };
  
  const location = useLocation();

  const menuItems = [
    { icon: Store, label: "Stores", path: "/owner/stores" },
    { icon: History, label: "Orders", path: "/owner/orders" },
    { icon: Settings, label: "Settings", path: "/owner/settings" },
  ];

  return (
    <header className="bg-surface shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center gap-6 h-16">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "text-secondary font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
          {ownerData?.first_name && (
            <Avatar className="ml-auto">
              <AvatarFallback className="bg-secondary text-white">
                {getInitials(`${ownerData.first_name} ${ownerData.last_name}`)}
              </AvatarFallback>
            </Avatar>
          )}
        </nav>
      </div>
    </header>
  );
};
