
import { useState } from "react";
import { motion } from "framer-motion";
import { List, Map, Navigation, ArrowLeft } from "lucide-react";
import { Store } from "@/types/store";
import { stores } from "@/data/stores";
import { StoreCard } from "@/components/StoreCard";

const Shopper = () => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
  };

  const handleBack = () => {
    setSelectedStore(null);
  };

  if (!selectedStore) {
    return (
      <div className="min-h-screen bg-surface-secondary">
        <div className="container mx-auto p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Select a Store
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onClick={() => handleStoreSelect(store)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Stores
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <List className="w-5 h-5 text-secondary" />
                Products at {selectedStore.name}
              </h2>
              <div className="space-y-4">
                {selectedStore.products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">
                        Location: {product.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${product.price}</p>
                      <span
                        className={`text-sm ${
                          product.inStock
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                ))}
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
                Shopping Route
              </h2>
              <div className="h-64 bg-gray-100 rounded-lg mb-4"></div>
              <p className="text-gray-600">
                Get the most efficient shopping route based on your list. Feature
                coming soon!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Shopper;
