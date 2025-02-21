
import { useState } from "react";
import { motion } from "framer-motion";
import { ShopperHeader } from "@/components/ShopperHeader";
import { Ticket, Gift, Calendar } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { stores } from "@/data/stores";
import { CheckIn, UserPoints, Voucher } from "@/types/points";

// Mock data - replace with real data later
const mockCheckIns: CheckIn[] = [];
const mockUserPoints: UserPoints[] = stores.map(store => ({
  storeId: store.id,
  points: 0,
}));
const mockVouchers: Voucher[] = [];

const PointsManagement = () => {
  const handleRedeemVoucher = async (voucher: Voucher) => {
    // In a real app, this would verify points and update the backend
    toast.success(`Successfully redeemed ${voucher.name}!`);
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      <ShopperHeader />
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-secondary" />
                Your Points
              </h2>
              <div className="space-y-4">
                {mockUserPoints.map((userPoints) => {
                  const store = stores.find(s => s.id === userPoints.storeId);
                  return (
                    <div
                      key={userPoints.storeId}
                      className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                    >
                      <span className="font-medium">{store?.name}</span>
                      <span className="text-secondary font-bold">
                        {userPoints.points} points
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-surface rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-secondary" />
                Available Vouchers
              </h2>
              <div className="space-y-4">
                {mockVouchers.map((voucher) => {
                  const store = stores.find(s => s.id === voucher.storeId);
                  return (
                    <div
                      key={voucher.id}
                      className="bg-gray-50 rounded-lg p-4 space-y-2"
                    >
                      <h3 className="font-medium">{voucher.name}</h3>
                      <p className="text-sm text-gray-600">
                        {voucher.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Expires: {format(voucher.expiryDate, "MMM d, yyyy")}
                        </span>
                        <button
                          onClick={() => handleRedeemVoucher(voucher)}
                          className="bg-secondary text-white px-3 py-1.5 rounded text-sm"
                        >
                          Redeem ({voucher.pointsCost} points)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" />
              Check-in History
            </h2>
            <div className="space-y-4">
              {mockCheckIns.map((checkIn) => {
                const store = stores.find(s => s.id === checkIn.storeId);
                return (
                  <div
                    key={checkIn.id}
                    className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-medium">{store?.name}</h3>
                      <p className="text-sm text-gray-600">
                        {format(checkIn.timestamp, "MMM d, yyyy h:mm a")}
                      </p>
                    </div>
                    <span className="text-secondary font-medium">
                      +{checkIn.points} points
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PointsManagement;
