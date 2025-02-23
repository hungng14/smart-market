import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Shopper from "@/pages/Shopper";
import StoreOwner from "@/pages/StoreOwner";
import ProductHistory from "@/pages/ProductHistory";
import PointsManagement from "@/pages/PointsManagement";
import NotFound from "@/pages/NotFound";
import StoreDetail from "@/pages/StoreDetail";
import StoreSelection from "@/pages/StoreSelection";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shopper" element={<Shopper />} />
        <Route path="/shopper/store/:storeId" element={<StoreDetail />} />
        <Route path="/shopper/points" element={<PointsManagement />} />
        <Route path="/shopper/history" element={<ProductHistory />} />
        <Route path="/owner/stores" element={<StoreSelection />} />
        <Route path="/owner/store/:storeId" element={<StoreOwner />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
