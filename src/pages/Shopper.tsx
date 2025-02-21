import { useState } from "react";
import { motion } from "framer-motion";
import { List, Map, Navigation, ArrowLeft, MapPin, DoorOpen, CheckSquare, DollarSign } from "lucide-react";
import { Store } from "@/types/store";
import { stores } from "@/data/stores";
import { StoreCard } from "@/components/StoreCard";
import { toast } from "sonner";
import { ShopperHeader } from "@/components/ShopperHeader";

interface PurchasedProduct {
  id: string;
  name: string;
  price: number;
  checked: boolean;
}

const Shopper = () => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [purchasedProducts, setPurchasedProducts] = useState<PurchasedProduct[]>([]);
  const [showChecklist, setShowChecklist] = useState(false);

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    setSelectedProducts([]);
  };

  const handleBack = () => {
    if (showChecklist) {
      setShowChecklist(false);
    } else {
      setSelectedStore(null);
      setSelectedProducts([]);
    }
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCheckout = () => {
    if (!selectedStore || selectedProducts.length === 0) return;
    
    const newPurchasedProducts = selectedProducts.map(id => {
      const product = selectedStore.products.find(p => p.id === id);
      if (!product) return null;
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        checked: false,
      };
    }).filter((p): p is PurchasedProduct => p !== null);

    setPurchasedProducts(prev => [...prev, ...newPurchasedProducts]);
    setShowChecklist(true);
    toast.success("Checkout successful! Your items have been added to the checklist.");
  };

  const handleToggleChecked = (productId: string) => {
    setPurchasedProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, checked: !product.checked }
          : product
      )
    );
  };

  const totalSpent = purchasedProducts.reduce((sum, product) => sum + product.price, 0);
  const remainingItems = purchasedProducts.filter(p => !p.checked).length;

  const getOptimizedRoute = (products: string[]) => {
    if (!selectedStore) return [];
    return selectedStore.products
      .filter(p => products.includes(p.id))
      .sort((a, b) => {
        const [aAisle, aPos] = a.location.split('');
        const [bAisle, bPos] = b.location.split('');
        return aAisle.localeCompare(bAisle) || aPos.localeCompare(bPos);
      });
  };

  if (showChecklist) {
    return (
      <div className="min-h-screen bg-surface-secondary">
        <ShopperHeader />
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
              Back to Shopping
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-secondary" />
                  Shopping Checklist
                </h2>
                <div className="space-y-4">
                  {purchasedProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`bg-gray-50 rounded-lg p-4 flex justify-between items-center cursor-pointer ${
                        product.checked ? "bg-gray-100" : ""
                      }`}
                      onClick={() => handleToggleChecked(product.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                          product.checked ? "bg-secondary border-secondary" : "border-gray-300"
                        }`}>
                          {product.checked && (
                            <CheckSquare className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className={product.checked ? "line-through text-gray-500" : ""}>
                          {product.name}
                        </span>
                      </div>
                      <span className="font-medium">${product.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-secondary" />
                  Shopping Summary
                </h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Total Spent</span>
                      <span className="font-semibold text-xl">${totalSpent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Remaining Items</span>
                      <span className="font-medium">{remainingItems} items</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!selectedStore) {
    return (
      <div className="min-h-screen bg-surface-secondary">
        <ShopperHeader />
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

  const optimizedRoute = getOptimizedRoute(selectedProducts);

  return (
    <div className="min-h-screen bg-surface-secondary">
      <ShopperHeader />
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
                    className={`bg-gray-50 rounded-lg p-4 flex justify-between items-center cursor-pointer ${
                      selectedProducts.includes(product.id)
                        ? "ring-2 ring-secondary"
                        : ""
                    }`}
                    onClick={() => handleProductToggle(product.id)}
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
              <div className="grid grid-cols-4 gap-2 aspect-square relative">
                <div className="absolute -left-8 top-0 flex items-center gap-1 text-secondary font-medium">
                  <DoorOpen className="w-5 h-5" />
                  Entrance
                </div>
                <div className="absolute -left-2 top-2 text-accent">
                  <MapPin className="w-6 h-6" />
                </div>
                {[
                  ["A1", "A2", "A3", "A4"],
                  ["B1", "B2", "B3", "B4"],
                  ["C1", "C2", "C3", "C4"],
                  ["D1", "D2", "D3", "D4"],
                  ["E1", "E2", "E3", "E4"],
                ].flat().map((cell) => {
                  const product = selectedStore.products.find(
                    (p) => p.location === cell
                  );
                  const isSelected = product && selectedProducts.includes(product.id);
                  return (
                    <div
                      key={cell}
                      className={`border rounded-lg p-2 text-sm ${
                        isSelected
                          ? "bg-secondary border-secondary"
                          : product
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

            <div className="col-span-1 md:col-span-2 bg-surface rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-secondary" />
                  Shopping Route
                </h2>
                {selectedProducts.length > 0 && (
                  <button
                    onClick={handleCheckout}
                    className="bg-secondary hover:bg-secondary-hover text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <DollarSign className="w-5 h-5" />
                    Checkout
                  </button>
                )}
              </div>
              {selectedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-gray-600 font-medium">
                      Step-by-step directions:
                    </p>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Starting point: Main entrance (near A1)
                        </p>
                      </div>
                      {optimizedRoute.map((product, index) => (
                        <div
                          key={product.id}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-4 mb-2">
                            <span className="bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center font-medium">
                              {index + 1}
                            </span>
                            <div>
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="text-sm text-gray-600">
                                Location: {product.location}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            {index === 0 
                              ? `From the entrance, go to aisle ${product.location[0]} and find position ${product.location[1]}.`
                              : `From ${optimizedRoute[index - 1].location}, move to aisle ${product.location[0]} position ${product.location[1]}.`
                            }
                          </p>
                        </div>
                      ))}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">
                          Return to entrance with your items.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 font-medium mb-4">
                      Route Map:
                    </p>
                    <div className="grid grid-cols-4 gap-2 aspect-square relative">
                      <div className="absolute -left-8 top-0 flex items-center gap-1 text-secondary font-medium">
                        <DoorOpen className="w-5 h-5" />
                      </div>
                      <div className="absolute -left-2 top-2 text-accent">
                        <MapPin className="w-6 h-6" />
                      </div>
                      {[
                        ["A1", "A2", "A3", "A4"],
                        ["B1", "B2", "B3", "B4"],
                        ["C1", "C2", "C3", "C4"],
                        ["D1", "D2", "D3", "D4"],
                        ["E1", "E2", "E3", "E4"],
                      ].flat().map((cell) => {
                        const product = selectedStore.products.find(
                          (p) => p.location === cell
                        );
                        const isSelected = product && selectedProducts.includes(product.id);
                        const routeIndex = optimizedRoute.findIndex(p => p.location === cell);
                        return (
                          <div
                            key={cell}
                            className={`border rounded-lg p-2 text-sm ${
                              isSelected
                                ? "bg-secondary border-secondary"
                                : product
                                ? "bg-secondary/10 border-secondary"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="font-medium">{cell}</div>
                            {isSelected && (
                              <div className="bg-white text-secondary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                                {routeIndex + 1}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">
                  Select products to see your optimized shopping route.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Shopper;
