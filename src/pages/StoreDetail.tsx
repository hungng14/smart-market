import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  List,
  Map,
  Navigation,
  ArrowLeft,
  MapPin,
  DoorOpen,
  CheckSquare,
  DollarSign,
  Search,
  Mic,
} from "lucide-react";

import { Store } from "@/types/store";
import { supabase } from "@/integrations/supabase/client";
import { ShopperHeader } from "@/components/ShopperHeader";
import { toast } from "sonner";
import { booths } from "@/data/booths"; // Import booths data

interface PurchasedProduct {
  id: string;
  name: string;
  price: number;
  checked: boolean;
}

const PRODUCTS_PER_PAGE = 10;

const StoreDetail = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [purchasedProducts, setPurchasedProducts] = useState<
    PurchasedProduct[]
  >([]);
  const [showChecklist, setShowChecklist] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false); // Added state for recommending

  useEffect(() => {
    fetchStoreDetails();
    fetchProducts();
  }, [storeId]);

  const fetchStoreDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("store")
        .select("id, name, address, banner_url")
        .eq("id", storeId)
        .single();

      if (error) throw error;
      if (data) {
        setSelectedStore(data);
      } else {
        navigate("/shopper");
      }
    } catch (error) {
      console.error("Error fetching store:", error);
      toast.error("Failed to fetch store details");
      navigate("/shopper");
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, booth, description, image_url")
        .eq("store_id", storeId);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHasMore(page * PRODUCTS_PER_PAGE < products.length);
  }, [page, products]);

  const filteredProducts =
    products?.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.booth?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const displayedProducts = filteredProducts.slice(0, page * PRODUCTS_PER_PAGE);

  useEffect(() => {
    if (!hasMore) return;

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    if (lastProductRef.current) {
      observer.current.observe(lastProductRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, filteredProducts]);

  const startVoiceSearch = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Voice search is not supported in this browser.");
    }
  };

  const handleBack = () => {
    if (showChecklist) {
      setShowChecklist(false);
    } else {
      navigate("/shopper");
    }
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleCheckout = () => {
    if (!selectedStore || selectedProducts.length === 0) return;

    const newPurchasedProducts = selectedProducts
      .map((id) => {
        const product = products.find((p) => p.id === id);
        if (!product) return null;
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          checked: false,
        };
      })
      .filter((p): p is PurchasedProduct => p !== null);

    setPurchasedProducts(newPurchasedProducts);
    setShowChecklist(true);
  };

  const handleToggleChecked = (productId: string) => {
    setPurchasedProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, checked: !product.checked }
          : product,
      ),
    );
  };

  const handleGetRecommendations = async (period: "today" | "week") => {
    try {
      setIsRecommending(true); // Set loading state
      // First get all products from Supabase
      const { data: allProducts, error } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", storeId);

      if (error) throw error;

      const productsList = allProducts
        .map((p) => `${p.name} (${p.description || "No description"})`)
        .join("\n");

      // Create prompt based on period
      const prompt = `Given this list of products:\n${productsList}\n\nSuggest 5 products that would make sense to buy together ${
        period === "today" ? "today" : "this week"
      }. Only return the exact product names from the list, separated by commas.`;

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
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get recommendations from Gemini API");
      }

      const data = await response.json();
      const text = data.candidates[0]?.content?.parts?.[0]?.text || "";
      const suggestedProductNames = text.split(",").map((name) => name.trim());

      const recommendedProductIds = allProducts
        .filter((p) => suggestedProductNames.includes(p.name))
        .map((p) => p.id);

      setSelectedProducts(recommendedProductIds);
      setShowRecommendations(false); // Close the box
      toast.success(
        `Found ${recommendedProductIds.length} recommended products`,
      );
    } catch (error) {
      console.error("Error getting recommendations:", error);
      toast.error("Failed to get recommendations");
    } finally {
      setIsRecommending(false); // Update loading state
    }
  };

  const getOptimizedRoute = (productIds: string[]) => {
    if (!selectedStore) return [];
    return products
      .filter((p) => productIds.includes(p.id))
      .sort((a, b) => {
        const boothA = booths.find((booth) => booth.name === a.booth);
        const boothB = booths.find((booth) => booth.name === b.booth);
        if (!boothA || !boothB) return 0;
        return boothA.position.localeCompare(boothB.position);
      });
  };

  if (!selectedStore) {
    return null;
  }

  if (showChecklist) {
    return (
      <div className="min-h-screen bg-surface-secondary">
        <ShopperHeader />
        <div className="container mx-auto p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mx-auto"
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
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center ${
                            product.checked
                              ? "bg-secondary border-secondary"
                              : "border-gray-300"
                          }`}
                        >
                          {product.checked && (
                            <CheckSquare className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span
                          className={
                            product.checked ? "line-through text-gray-500" : ""
                          }
                        >
                          {product.name}
                        </span>
                      </div>
                      <span className="font-medium">${product.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={async () => {
                        if (purchasedProducts.some((p) => p.checked)) {
                          try {
                            const checkedProducts = purchasedProducts.filter(
                              (p) => p.checked,
                            );
                            const totalMoney = checkedProducts.reduce(
                              (sum, p) => sum + p.price,
                              0,
                            );

                            const userData = localStorage.getItem("userData");
                            const parsedUserData = userData
                              ? JSON.parse(userData)
                              : null;

                            const orderData = {
                              user_id: parsedUserData?.id || null,
                              total_money: totalMoney,
                              items: checkedProducts.map((p) => ({
                                product_id: p.id,
                                price: p.price,
                                name: p.name,
                                booth:
                                  products.find((prod) => prod.id === p.id)
                                    ?.booth || "",
                                image_url:
                                  products.find((prod) => prod.id === p.id)
                                    ?.image_url || "",
                              })),
                            };

                            const { error } = await supabase
                              .from("order_history")
                              .insert([orderData]);

                            if (error) throw error;

                            toast.success(
                              "Purchase confirmed! Thank you for shopping!",
                            );
                            setPurchasedProducts([]);
                            setShowChecklist(false);
                          } catch (error) {
                            console.error("Error saving order:", error);
                            toast.error(
                              "Failed to save your order. Please try again.",
                            );
                          }
                        } else {
                          toast.error(
                            "Please check at least one item before confirming purchase",
                          );
                        }
                      }}
                      className={`px-6 py-3 rounded-lg font-medium ${
                        purchasedProducts.some((p) => p.checked)
                          ? "bg-secondary text-white hover:bg-secondary/90"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Confirm Purchase
                    </button>
                  </div>
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
                      <span className="font-semibold text-xl">
                        $
                        {purchasedProducts
                          .reduce((sum, p) => sum + p.price, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Remaining Items</span>
                      <span className="font-medium">
                        {purchasedProducts.filter((p) => !p.checked).length}{" "}
                        items
                      </span>
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

  const optimizedRoute = getOptimizedRoute(selectedProducts);

  return (
    <div className="min-h-screen bg-surface-secondary">
      <ShopperHeader />
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mx-auto"
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
                Products at {selectedStore?.name}
              </h2>

              <div className="sticky top-0 z-10 bg-surface pt-4 pb-2 mb-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products or booth..."
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm"
                    />
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowRecommendations(true)}
                      disabled={isRecommending}
                      className={`px-4 py-3 rounded-lg bg-secondary text-white hover:bg-secondary/90 transition-colors shadow-sm inline-flex items-center gap-2 ${isRecommending ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isRecommending ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Recommending...
                        </>
                      ) : (
                        'Recommend'
                      )}
                    </button>
                    {showRecommendations && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <button
                          onClick={() => {
                            handleGetRecommendations("today");
                            setShowRecommendations(false); // Close box on click
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-t-lg"
                        >
                          Suggest products for today
                        </button>
                        <button
                          onClick={() => {
                            handleGetRecommendations("week");
                            setShowRecommendations(false); //Close box on click
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-b-lg"
                        >
                          Suggest products for this week
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={startVoiceSearch}
                    className={`p-3 rounded-lg ${
                      isListening
                        ? "bg-secondary text-white"
                        : "bg-gray-100 text-gray-600"
                    } hover:bg-secondary hover:text-white transition-colors shadow-sm`}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto px-2 py-2">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4 flex gap-4 items-center animate-pulse">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                        <div className="w-16">
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  displayedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    ref={
                      index === displayedProducts.length - 1
                        ? lastProductRef
                        : null
                    }
                    className={`bg-gray-50 rounded-lg p-4 flex gap-4 items-center cursor-pointer ${
                      selectedProducts.includes(product.id)
                        ? "ring-2 ring-secondary"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleProductToggle(product.id);
                    }}
                  >
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-600">
                          Booth: {product.booth}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${product.price}</p>
                      </div>
                    </div>
                  </div>
                )))}
                {!loading && hasMore && (
                  <div className="text-center py-4">
                    <span className="text-gray-500">
                      Loading more products...
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-surface rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-secondary" />
                Shopping Route
                <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm">
                  {selectedProducts.length} items selected
                </span>
              </h2>
              {selectedProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <p className="text-gray-600 font-medium">
                      Step-by-step directions:
                    </p>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Starting point: Main entrance (near Counter 1, Position 1)
                        </p>
                      </div>
                      {Object.entries(
                        optimizedRoute.reduce(
                          (acc, product) => {
                            if (!acc[product.booth]) {
                              acc[product.booth] = [];
                            }
                            acc[product.booth].push(product);
                            return acc;
                          },
                          {} as Record<string, typeof optimizedRoute>,
                        ),
                      ).map(([booth, products], index) => (
                        <div key={booth} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-4 mb-2">
                            <span className="bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center font-medium">
                              {index + 1}
                            </span>
                            <div>
                              <h3 className="font-medium">{booth}</h3>
                              <p className="text-sm text-gray-600">
                                Products:{" "}
                                {products.map((p) => p.name).join(", ")}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            {index === 0
                              ? `From the entrance, go to ${booth} located at booth ${booths.find((b) => b.name === booth)?.position[1]} of counter ${booths.find((b) => b.name === booth)?.position[0].charCodeAt(0) - 64}. Here you'll find ${products.map((p) => p.name).join(", ")}.`
                              : `From ${
                                  Object.keys(
                                    optimizedRoute.reduce(
                                      (acc, product) => {
                                        if (!acc[product.booth]) {
                                          acc[product.booth] = [];
                                        }
                                        acc[product.booth].push(product);
                                        return acc;
                                      },
                                      {} as Record<
                                        string,
                                        typeof optimizedRoute
                                      >,
                                    ),
                                  )[index - 1]
                                }, move to ${booth} at booth ${booths.find((b) => b.name === booth)?.position[1]} of counter ${booths.find((b) => b.name === booth)?.position[0].charCodeAt(0) - 64}. Look for ${products.map((p) => p.name).join(", ")}.`}
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
                </div>
              ) : (
                <p className="text-gray-600">
                  Select products to see your optimized shopping route.
                </p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2 bg-surface rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Map className="w-5 h-5 text-secondary" />
                    Store Map
                  </h2>
                </div>
                {selectedProducts.length > 0 && (
                  <button
                    onClick={handleCheckout}
                    className="bg-secondary hover:bg-secondary-hover text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <DollarSign className="w-5 h-5" />
                    My Checklist
                  </button>
                )}
              </div>

              <div>
                <div className="grid grid-cols-[100px,1fr]">
                  <div className="relative">
                    <div className="top-0 flex items-center gap-1 text-secondary font-medium">
                      <DoorOpen className="w-5 h-5" />
                      Entrance
                    </div>
                    <div className="top-2 text-accent">
                      <MapPin className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 lg:aspect-square relative">
                    {/* SVG layer for route paths */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                      {optimizedRoute.map((product, index) => {
                        if (index === 0) return null;

                        const prevProduct = optimizedRoute[index - 1];
                        const prevBooth = booths.find(
                          (b) => b.name === prevProduct.booth,
                        );
                        const currentBooth = booths.find(
                          (b) => b.name === product.booth,
                        );
                        if (!prevBooth || !currentBooth) return null;

                        // Check if booths are in the same counter
                        const prevCounter = prevBooth.position[0];
                        const currentCounter = currentBooth.position[0];
                        const prevNumber = parseInt(prevBooth.position[1]);
                        const currentNumber = parseInt(
                          currentBooth.position[1],
                        );

                        // Calculate positions based on grid and counter proximity
                        const prevCol = prevNumber - 1;
                        const prevRow =
                          prevBooth.position[0].charCodeAt(0) - 65;
                        const currentCol = currentNumber - 1;
                        const currentRow =
                          currentBooth.position[0].charCodeAt(0) - 65;

                        const cellWidth = 100 / 4; // 4 columns
                        const cellHeight = 100 / 5; // 5 rows (A-E)
                        const x1 = prevCol * cellWidth + cellWidth / 2;
                        const y1 = prevRow * cellHeight + cellHeight / 2;
                        const x2 = currentCol * cellWidth + cellWidth / 2;
                        const y2 = currentRow * cellHeight + cellHeight / 2;

                        return (
                          <g key={`path-${index}`}>
                            <line
                              x1={`${x1}%`}
                              y1={`${y1}%`}
                              x2={`${x2}%`}
                              y2={`${y2}%`}
                              stroke="#FF6B6B"
                              strokeWidth="4"
                              strokeDasharray="8"
                              className="animate-dash"
                            />
                            <circle
                              cx={`${x2}%`}
                              cy={`${y2}%`}
                              r="3"
                              fill={
                                prevCounter === currentCounter
                                  ? "#4F46E5"
                                  : "#10B981"
                              }
                              className="animate-pulse"
                            />
                          </g>
                        );
                      })}
                    </svg>
                    {booths.map((booth) => {
                      const product = products.find(
                        (p) =>
                          p.booth === booth.name &&
                          selectedProducts.includes(p.id),
                      );
                      const isSelected = !!product;
                      return (
                        <div
                          key={booth.name}
                          className={`border rounded-lg overflow-hidden w-full min-h-[60px] lg:h-[180px] group flex flex-col relative ${
                            isSelected
                              ? "ring-4 ring-secondary shadow-lg"
                              : product
                                ? "ring-2 ring-secondary/30"
                                : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <img
                            src={booth.boothImage}
                            alt={`Booth ${booth.name}`}
                            className="w-full h-3/5 md:block hidden object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                          />
                          <div className="font-medium text-secondary text-[11px] md:text-[13px] p-1 text-black">
                            {booth.name}
                          </div>
                          {isSelected && (
                            <div
                              className={`absolute ${optimizedRoute[0]?.booth === booth.name ? "top-0 left-0 bg-blue-600 text-white px-3 py-1.5 text-sm font-bold rounded-br-lg shadow-md" : "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-md"}`}
                            >
                              {optimizedRoute[0]?.booth === booth.name
                                ? "Start Here"
                                : (() => {
                                    const uniqueBooths = [
                                      ...new Set(
                                        optimizedRoute.map((p) => p.booth),
                                      ),
                                    ];
                                    return uniqueBooths.findIndex(
                                      (b) => b === booth.name,
                                    );
                                  })() + 1}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StoreDetail;