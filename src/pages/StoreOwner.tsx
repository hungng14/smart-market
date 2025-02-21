
import { motion } from "framer-motion";
import {
  LayoutGrid,
  ChartBarIcon,
  PackageSearch,
  Settings,
} from "lucide-react";

const StoreOwner = () => {
  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="bg-surface rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-secondary" />
              Store Layout
            </h2>
            <div className="aspect-video bg-gray-100 rounded-lg mb-4"></div>
            <p className="text-gray-600">
              Interactive map coming soon. Manage your store sections and product
              placements efficiently.
            </p>
          </div>

          <div className="bg-surface rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-secondary" />
              Sales Analytics
            </h2>
            <div className="space-y-4">
              <div className="h-32 bg-gray-100 rounded-lg"></div>
              <p className="text-gray-600">
                Track your store's performance with detailed analytics and insights.
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <PackageSearch className="w-5 h-5 text-secondary" />
              Inventory Management
            </h2>
            <div className="space-y-4">
              <div className="h-32 bg-gray-100 rounded-lg"></div>
              <p className="text-gray-600">
                Monitor stock levels and manage product placements efficiently.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StoreOwner;
