
import { useNavigate } from "react-router-dom";
import { Store, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { RoleCard } from "@/components/RoleCard";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to CartCaddy
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose your role to get started with an optimized shopping experience
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-6 justify-center items-center max-w-4xl mx-auto"
        >
          <RoleCard
            title="Store Owner"
            description="Manage your store layout, track inventory, and analyze sales performance"
            icon={<Store className="w-6 h-6" />}
            onClick={() => navigate("/login")}
          />
          <RoleCard
            title="Shopper"
            description="Create shopping lists, find products easily, and get optimized routes"
            icon={<ShoppingCart className="w-6 h-6" />}
            onClick={() => navigate("/login")}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
