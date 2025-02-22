
import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Calendar } from "lucide-react";
import { ShopperHeader } from "@/components/ShopperHeader";
import { format } from "date-fns";

interface Product {
  id: string;
  name: string;
  price: number;
  purchaseDate: Date;
}

const ProductHistory = () => {
  const [dateFilter, setDateFilter] = useState<string>("");
  
  // This would typically come from your state management
  // For now using mock data
  const purchasedProducts: Product[] = [
    {
      id: "1",
      name: "Milk",
      price: 3.99,
      purchaseDate: new Date("2024-03-15"),
    },
    {
      id: "2",
      name: "Bread",
      price: 2.99,
      purchaseDate: new Date("2024-03-14"),
    },
    // Add more mock products as needed
  ];

  // Filter products by date
  const filteredProducts = dateFilter
    ? purchasedProducts.filter(
        (product) =>
          format(product.purchaseDate, "yyyy-MM-dd") === dateFilter
      )
    : purchasedProducts;

  // Sort products by date (newest first)
  const sortedProducts = [...filteredProducts].sort(
    (a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime()
  );

  // Calculate top products
  const productCounts = purchasedProducts.reduce((acc, product) => {
    acc[product.name] = (acc[product.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topProducts = Object.entries(productCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Calculate total spending
  const totalSpent = purchasedProducts.reduce(
    (sum, product) => sum + product.price,
    0
  );

  return (
    <div className="min-h-screen bg-surface-secondary">
      <ShopperHeader />
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Purchase History</h1>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                Top Products
              </h2>
              <div className="space-y-4">
                {topProducts.map(([name, count]) => (
                  <div
                    key={name}
                    className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                  >
                    <span className="font-medium">{name}</span>
                    <span className="text-gray-600">
                      Bought {count} times
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-secondary" />
                Total Spending
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <span className="text-3xl font-bold text-secondary">
                  ${totalSpent.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Purchase History</h2>
            <div className="space-y-4">
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600">
                      {format(product.purchaseDate, "MMMM d, yyyy")}
                    </p>
                  </div>
                  <span className="font-medium">${product.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductHistory;
