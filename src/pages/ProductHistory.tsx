
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MessagesSquare, BrainCircuit } from "lucide-react";
import { ShopperHeader } from "@/components/ShopperHeader";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProductHistory = () => {
  const [dateFilter, setDateFilter] = useState("");
  const [orderHistory, setOrderHistory] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [aiResponse, setAiResponse] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchOrderHistory();
  }, [dateFilter]);

  const fetchOrderHistory = async () => {
    try {
      const userData = localStorage.getItem("userData");
      const parsedUserData = userData ? JSON.parse(userData) : null;

      let query = supabase
        .from("order_history")
        .select("*")
        .eq("user_id", parsedUserData?.id);

      if (dateFilter) {
        query = query.gte("created_at", `${dateFilter}T00:00:00`)
          .lte("created_at", `${dateFilter}T23:59:59`);
      }

      const { data, error } = await query;
      if (error) throw error;

      setOrderHistory(data || []);
      calculateTotalSpent(data);
      analyzeTopProducts(data);
    } catch (error) {
      console.error("Error fetching order history:", error);
      toast.error("Failed to fetch order history");
    }
  };

  const calculateTotalSpent = (orders) => {
    const total = orders.reduce((sum, order) => sum + order.total_money, 0);
    setTotalSpent(total);
  };

  const analyzeTopProducts = (orders) => {
    const productCounts = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        productCounts[item.name] = (productCounts[item.name] || 0) + 1;
      });
    });

    const sortedProducts = Object.entries(productCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    setTopProducts(sortedProducts);
  };

  const handleAnalyzeHabits = async (type) => {
    setIsAnalyzing(true);
    try {
      const GEMINI_API_KEY = "AIzaSyC6lR0x5BhzEL6b0AGjqY6n9v5w90cVDNc";
      const prompt = type === 'week' 
        ? "Review my purchase history and suggest what products I might need this week based on my buying patterns:"
        : "Analyze my buying habits and provide insights on my shopping behavior:";

      const purchaseData = orderHistory.map(order => {
        return `Order on ${new Date(order.created_at).toLocaleDateString()}: ${order.items.map(item => item.name).join(', ')}`;
      }).join('\n');

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${prompt}\n\nPurchase History:\n${purchaseData}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to get AI analysis");
      const data = await response.json();
      setAiResponse(data.candidates[0]?.content?.parts?.[0]?.text || "No insights available.");
    } catch (error) {
      console.error("Error analyzing habits:", error);
      toast.error("Failed to analyze shopping habits");
      setAiResponse("Failed to analyze shopping habits. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const chartData = {
    labels: topProducts.map(([name]) => name),
    datasets: [
      {
        data: topProducts.map(([, count]) => count),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      <ShopperHeader />
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6">
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
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Top 10 Purchased Products</h2>
                <div className="aspect-square">
                  <Pie data={chartData} options={{ maintainAspectRatio: true }} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Shopping Assistant</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAnalyzeHabits('week')}
                      disabled={isAnalyzing}
                      className="flex-1 bg-secondary text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <MessagesSquare className="w-5 h-5" />
                      Review Weekly Products
                    </button>
                    <button
                      onClick={() => handleAnalyzeHabits('habits')}
                      disabled={isAnalyzing}
                      className="flex-1 bg-secondary text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <BrainCircuit className="w-5 h-5" />
                      Analyze Habits
                    </button>
                  </div>
                  {isAnalyzing ? (
                    <div className="text-center py-4">
                      <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="mt-2 text-gray-600">Analyzing your shopping patterns...</p>
                    </div>
                  ) : aiResponse && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 whitespace-pre-line">{aiResponse}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Total Spending</h2>
                <p className="text-3xl font-bold text-secondary">
                  ${totalSpent.toFixed(2)}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Purchase Details</h2>
                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                        <span className="font-semibold">${order.total_money.toFixed(2)}</span>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name}</span>
                            <span>${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductHistory;
