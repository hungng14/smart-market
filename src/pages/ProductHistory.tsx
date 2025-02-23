
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import { Calendar, MessagesSquare, BrainCircuit } from "lucide-react";
import { ShopperHeader } from "@/components/ShopperHeader";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
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
        query = query
          .gte("created_at", `${dateFilter}T00:00:00`)
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
    orders.forEach((order) => {
      order.items.forEach((item) => {
        productCounts[item.name] = (productCounts[item.name] || 0) + 1;
      });
    });

    const sortedProducts = Object.entries(productCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    setTopProducts(sortedProducts);
  };

  const handleAnalyzeHabits = async (type: "week" | "habits") => {
    try {
      setIsAnalyzing(true);

      const { data: orderHistory, error } = await supabase
        .from("order_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("error", error);
        return toast.error("Failed to analyze shopping habits");
      }

      const productsList = orderHistory
        .map((order) =>
          order.items.map(
            (item: any) => `${item.name} (Price: $${item.price})`,
          ),
        )
        .flat()
        .join("\n");

      const prompt =
        type === "week"
          ? `Based on this customer's recent purchases:\n${productsList}\n\nAnalyze their weekly shopping patterns and provide personalized recommendations for their next shopping trip. Consider factors like product categories, frequency of purchases, and potential complementary items.`
          : `Given this customer's purchase history:\n${productsList}\n\nAnalyze their shopping habits and provide insights on: 1) Most frequently bought items 2) Shopping patterns 3) Suggestions for better shopping habits 4) Potential ways to optimize their shopping experience.`;

      const GEMINI_API_KEY = "AIzaSyC6lR0x5BhzEL6b0AGjqY6n9v5w90cVDNc";
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
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        return toast.error("Failed to analyze shopping habits");
      }

      const data = await response.json();
      const text = data.candidates[0]?.content?.parts?.[0]?.text || "";
      setAiResponse(text);
    } catch (error) {
      console.error("Error analyzing habits:", error);
      toast.error("Failed to analyze shopping habits");
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
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
        ],
      },
    ],
  };

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
            <h1 className="text-3xl font-bold text-gray-900">
              Purchase History
            </h1>
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

          {/* First Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Pie Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">
                Top 10 Purchased Products
              </h2>
              <div className="aspect-square">
                <Pie data={chartData} options={{ maintainAspectRatio: true }} />
              </div>
            </div>

            {/* Right: Total Spending & Purchase Details */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Total Spending</h2>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-secondary">
                    ${totalSpent.toFixed(2)}
                  </p>
                  <p className="text-gray-500">lifetime total</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Purchase Details</h2>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {orderHistory.map((order) => (
                    <div 
                      key={order.id} 
                      className="bg-gray-50 rounded-lg p-4 transition-all hover:bg-gray-100"
                    >
                      <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-2">
                        <span className="text-gray-600 font-medium">
                          {new Date(order.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="font-semibold text-secondary">
                          ${order.total_money.toFixed(2)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm py-1"
                          >
                            <span className="text-gray-700">{item.name}</span>
                            <span className="text-gray-900">${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Second Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-secondary" />
                Shopping Assistant
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAnalyzeHabits("week")}
                  disabled={isAnalyzing}
                  className="bg-secondary/10 text-secondary px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-secondary/20 transition-colors"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <MessagesSquare className="w-4 h-4" />
                      Review Weekly Products
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleAnalyzeHabits("habits")}
                  disabled={isAnalyzing}
                  className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-secondary/90 transition-colors"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="w-4 h-4" />
                      Analyze Habits
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              {isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-gray-800 font-medium">
                    Analyzing your shopping patterns...
                  </p>
                  <p className="text-gray-500 mt-2">
                    We're processing your shopping history to provide personalized insights
                  </p>
                </div>
              ) : aiResponse ? (
                <div className="prose prose-sm max-w-none">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <ReactMarkdown>
                      {aiResponse}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BrainCircuit className="w-16 h-16 text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-800 mb-3">
                    Get Personalized Shopping Insights
                  </h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Use our AI-powered shopping assistant to analyze your purchase history.
                    Get recommendations for your next shopping trip or understand your shopping patterns to make better decisions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductHistory;
