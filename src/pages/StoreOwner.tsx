
import { motion } from "framer-motion";
import {
  LayoutGrid,
  ChartBarIcon,
  PackageSearch,
  Settings,
} from "lucide-react";
import { stores } from "@/data/stores";

const StoreOwner = () => {
  // For demo purposes, we'll use the first store
  const store = stores[0];

  const gridCells = [
    ["A1", "A2", "A3", "A4"],
    ["B1", "B2", "B3", "B4"],
    ["C1", "C2", "C3", "C4"],
    ["D1", "D2", "D3", "D4"],
    ["E1", "E2", "E3", "E4"],
  ];

  const getProductForLocation = (location: string) => {
    return store.products.find((product) => product.location === location);
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-surface rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-secondary" />
              Store Layout
            </h2>
            <div className="grid grid-cols-4 gap-2 aspect-square">
              {gridCells.flat().map((cell) => {
                const product = getProductForLocation(cell);
                return (
                  <div
                    key={cell}
                    className={`border rounded-lg p-2 text-sm ${
                      product
                        ? "bg-secondary/10 border-secondary"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="font-medium">{cell}</div>
                    {product && (
                      <div className="text-xs text-gray-600 truncate">
                        {product.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-surface rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <PackageSearch className="w-5 h-5 text-secondary" />
              Products ({store.products.length})
            </h2>
            <div className="space-y-4">
              {store.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600">
                      Category: {product.category}
                    </p>
                    <p className="text-sm text-gray-600">
                      Location: {product.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${product.price}</p>
                    <span
                      className={`text-sm ${
                        product.inStock ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-surface rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-secondary" />
              Sales Analytics
            </h2>
            <div className="h-64 bg-gray-100 rounded-lg mb-4"></div>
            <p className="text-gray-600">
              Track your store's performance with detailed analytics and insights.
              Coming soon!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StoreOwner;
