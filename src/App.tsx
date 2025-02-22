
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "@/pages/Index";
import Shopper from "@/pages/Shopper";
import StoreOwner from "@/pages/StoreOwner";
import ProductHistory from "@/pages/ProductHistory";
import PointsManagement from "@/pages/PointsManagement";
import NotFound from "@/pages/NotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/shopper" element={<Shopper />} />
        <Route path="/shopper/points" element={<PointsManagement />} />
        <Route path="/shopper/history" element={<ProductHistory />} />
        <Route path="/owner" element={<StoreOwner />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
