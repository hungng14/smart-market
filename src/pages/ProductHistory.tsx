
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { ShopperHeader } from "@/components/ShopperHeader";
import { toast } from "sonner";

interface OrderHistoryItem {
  id: string;
  created_at: string;
  total_money: number;
  items: {
    name: string;
    price: number;
    booth: string;
    image_url: string;
  }[];
}

const ProductHistory = () => {
  const [dateFilter, setDateFilter] = useState<string>("");
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");

      if(!userData?.id) {
        setOrderHistory([]);

        return;
      }
      
      const { data, error } = await supabase
        .from("order_history")
        .select("*")
        .eq("user_id", userData?.id || "");

      if (error) {
        setOrderHistory([]);

        return;
      }
      setOrderHistory(data || []);
    } catch (error) {
      console.error("Error fetching order history:", error);
      toast.error("Failed to fetch order history");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders by date
  const filteredOrders = dateFilter
    ? orderHistory.filter(
        (order) => format(new Date(order.created_at), "yyyy-MM-dd") === dateFilter
      )
    : orderHistory;

  // Sort orders by date (newest first)
  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Calculate total spending for filtered orders
  const totalSpent = filteredOrders.reduce(
    (sum, order) => sum + order.total_money,
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

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Total Spending</h2>
            <p className="text-3xl font-bold text-secondary">
              ${totalSpent.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Purchase Details</h2>
            {loading ? (
              <p>Loading purchase history...</p>
            ) : sortedOrders.length > 0 ? (
              <div className="space-y-4">
                {sortedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        {format(new Date(order.created_at), "PPP")}
                      </p>
                      <p className="font-semibold">
                        ${order.total_money.toFixed(2)}
                      </p>
                    </div>
                    <div className="grid gap-3">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
                        >
                          <img
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Booth: {item.booth}
                            </p>
                          </div>
                          <p className="font-semibold">${item.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No purchase history found.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductHistory;
