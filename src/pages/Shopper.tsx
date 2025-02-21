
import { motion } from "framer-motion";
import { List, Map, Navigation } from "lucide-react";

const Shopper = () => {
  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-surface rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <List className="w-5 h-5 text-secondary" />
              Shopping List
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-gray-600">
                  Create and manage your shopping list here. Feature coming soon!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Map className="w-5 h-5 text-secondary" />
              Store Map
            </h2>
            <div className="aspect-video bg-gray-100 rounded-lg mb-4"></div>
            <p className="text-gray-600">
              Interactive store map with product locations coming soon.
            </p>
          </div>

          <div className="col-span-1 md:col-span-2 bg-surface rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-secondary" />
              Optimized Route
            </h2>
            <div className="h-64 bg-gray-100 rounded-lg mb-4"></div>
            <p className="text-gray-600">
              Get the most efficient shopping route based on your list. Feature
              coming soon!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Shopper;
