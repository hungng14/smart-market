
import { Store } from "@/types/store";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface StoreCardProps {
  store: Store;
  onClick: () => void;
}

export const StoreCard = ({ store, onClick }: StoreCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-surface rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="aspect-video bg-gray-100">
        <img
          src={store.image}
          alt={store.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900">{store.name}</h3>
        <p className="text-gray-600 mt-1 flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {store.address}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {store.products.length} products available
        </p>
      </div>
    </motion.div>
  );
};
