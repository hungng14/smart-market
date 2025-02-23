
import { motion } from "framer-motion";

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export const RoleCard = ({ title, description, icon, onClick }: RoleCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-surface p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer w-full max-w-sm"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 mt-1 text-sm">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};
