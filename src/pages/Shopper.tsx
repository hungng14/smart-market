
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Store } from "@/types/store";
import { StoreCard } from "@/components/StoreCard";
import { ShopperHeader } from "@/components/ShopperHeader";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const ShopperList = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('store')
        .select('id, name, address, banner_url');

      if (error) {
        throw error;
      }

      setStores(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch stores");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSelect = (store: Store) => {
    navigate(`/shopper/store/${store.id}`);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Select a Store
          </h1>
          {loading ? (
            <div className="text-center">Loading stores...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onClick={() => handleStoreSelect(store)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ShopperList;
