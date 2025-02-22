import { Store, History, Ticket } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "./ui/avatar";

export const ShopperHeader = () => {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  console.log("userData", userData);

  const getInitials = (userInfo?: {
    first_name?: string;
    last_name?: string;
  }) => {
    const fN = userInfo?.first_name?.[0] || "";
    const lN = userInfo?.last_name?.[0] || "";
    return fN + lN;
  };
  const location = useLocation();

  const menuItems = [
    { icon: Store, label: "Stores", path: "/shopper" },
    { icon: Ticket, label: "Points", path: "/shopper/points" },
    { icon: History, label: "History", path: "/shopper/history" },
  ];

  return (
    <header className="bg-surface shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center gap-6 h-16">
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
          {console.log("userData", userData)}
          {userData?.first_name ? (
            <Avatar className="ml-auto">{getInitials(userData)}</Avatar>
          ) : null}
        </nav>
      </div>
    </header>
  );
};
