import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  LayoutGrid,
  ChartBarIcon,
  PackageSearch,
  Users,
  QrCode,
  Plus,
} from "lucide-react";
import { booths } from "@/data/booths";
import { CheckIn } from "@/types/points";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductForm } from "@/components/ProductForm";
import { Product } from "@/types/store";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const StoreOwner = () => {
  const [store, setStore] = useState<any>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const { storeId } = useParams();

  useEffect(() => {
    fetchStore();
  }, [storeId]);

  const fetchStore = async () => {
    try {
      const { data, error } = await supabase
        .from("store")
        .select("*")
        .eq("id", storeId)
        .single();

      if (error) throw error;
      setStore(data);
    } catch (error) {
      toast.error("Failed to fetch store details");
      console.error(error);
    }
  };

  // Mock data - replace with real data later
  const mockCheckIns: CheckIn[] = [];

  const availableBooths = booths.map((booth) => booth.name);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      toast.error("Failed to fetch products");
      return;
    }

    setProducts(data || []);
  };

  const getProductForBooth = (booth: string) => {
    return products.find((product) => product.booth === booth);
  };

  const handleAddProduct = async (product: Omit<Product, "id">) => {
    const productWithStoreId = {
      ...product,
      store_id: store.id,
    };

    const { data, error } = await supabase
      .from("products")
      .insert([productWithStoreId])
      .select()
      .single();

    if (error) {
      throw error;
    }

    setProducts([...products, data]);
    setShowAddProduct(false);
  };

  const handleUpdateProduct = async (product: Omit<Product, "id">) => {
    if (!editingProduct) return;

    // Remove store_owner_id from the update
    const { store_owner_id, ...updateData } = product;

    const { error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", editingProduct.id);

    if (error) {
      throw error;
    }

    setProducts(
      products.map((p) =>
        p.id === editingProduct.id ? { ...product, id: editingProduct.id } : p,
      ),
    );
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-surface rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-secondary" />
              Store Map
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {booths.map((booth) => {
                const product = getProductForBooth(booth.name);
                return (
                  <div
                    key={booth.name}
                    className={`border rounded-lg p-2 text-sm relative overflow-hidden aspect-square group ${
                      product
                        ? "bg-secondary/10 border-secondary cursor-pointer"
                        : "bg-gray-50 border-gray-200"
                    }`}
                    onClick={() => product && setEditingProduct(product)}
                  >
                    <img
                      src={booth.boothImage}
                      alt={`Booth ${booth.name}`}
                      className="w-full h-3/5 md:block hidden object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="font-medium text-secondary text-[11px] md:text-[13px] p-1 text-black">
                      {booth.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-surface rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <PackageSearch className="w-5 h-5 text-secondary" />
                Products ({products.length})
              </h2>
              <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
                <DialogTrigger asChild>
                  <Button className="bg-secondary hover:bg-secondary/90 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <ProductForm
                    onSubmit={handleAddProduct}
                    availableBooths={availableBooths}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-50 rounded-lg p-4 flex items-center hover:bg-gray-100 transition-colors cursor-pointer gap-4"
                  onClick={() => setEditingProduct(product)}
                >
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">
                        Category: {product.category}
                      </p>
                      <p className="text-sm text-gray-600">
                        Booth: {product.booth}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${product.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Product Dialog */}
          <Dialog
            open={!!editingProduct}
            onOpenChange={() => setEditingProduct(null)}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
              </DialogHeader>
              {editingProduct && (
                <ProductForm
                  onSubmit={handleUpdateProduct}
                  initialProduct={editingProduct}
                  availableBooths={availableBooths}
                />
              )}
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </div>
  );
};

export default StoreOwner;
