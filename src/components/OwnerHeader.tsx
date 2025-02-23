import { Store, History, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const OwnerHeader = () => {
  const ownerData = JSON.parse(localStorage.getItem("ownerData") || "{}");

  const getInitials = (ownerData?: {
    first_name?: string;
    last_name?: string;
  }) => {
    if (!ownerData?.first_name) return "";
    const fN = ownerData?.first_name?.[0] || "";
    const lN = ownerData?.last_name?.[0] || "";
    return fN + lN;
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
            <span className="ml-auto rounded-full w-10 h-10 block p-2 bg-gray-200">
              {getInitials(ownerData)}
            </span>
          )}
        </nav>
      </div>
    </header>
  );
};
