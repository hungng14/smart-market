import { motion } from "framer-motion";
import {
  LayoutGrid,
  ChartBarIcon,
  PackageSearch,
  Users,
  QrCode,
  Plus,
} from "lucide-react";
import { stores } from "@/data/stores";
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

const StoreOwner = () => {
  const store = stores[0];
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // Mock data - replace with real data later
  const mockCheckIns: CheckIn[] = [];

  const gridCells = [
    ["A1", "A2", "A3", "A4"],
    ["B1", "B2", "B3", "B4"],
    ["C1", "C2", "C3", "C4"],
    ["D1", "D2", "D3", "D4"],
    ["E1", "E2", "E3", "E4"],
  ];

  const availableLocations = gridCells.flat();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      toast.error('Failed to fetch products');
      return;
    }

    setProducts(data || []);
  };

  const getProductForLocation = (location: string) => {
    return products.find((product) => product.location === location);
  };

  const handleAddProduct = async (product: Omit<Product, "id">) => {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
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

    const { error } = await supabase
      .from('products')
      .update(product)
      .eq('id', editingProduct.id);

    if (error) {
      throw error;
    }

    setProducts(products.map(p => 
      p.id === editingProduct.id ? { ...product, id: editingProduct.id } : p
    ));
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
              Store Layout
            </h2>
            <div className="grid grid-cols-4 gap-2 aspect-square">
              {gridCells.flat().map((cell) => {
                const product = getProductForLocation(cell);
                return (
                  <div
                    key={cell}
                    className={`border rounded-lg p-2 text-sm ${
                      product
                        ? "bg-secondary/10 border-secondary cursor-pointer"
                        : "bg-gray-50 border-gray-200"
                    }`}
                    onClick={() => product && setEditingProduct(product)}
                  >
                    <div className="font-medium">{cell}</div>
                    {product && (
                      <div className="text-xs text-gray-600 truncate">
                        {product.name}
                      </div>
                    )}
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
                  <Button
                    className="bg-secondary hover:bg-secondary/90 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
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
                    availableLocations={availableLocations}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-50 rounded-lg p-4 flex justify-between items-center hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setEditingProduct(product)}
                >
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600">
                      Category: {product.category}
                    </p>
                    <p className="text-sm text-gray-600">
                      Location: {product.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${product.price}</p>
                    <span
                      className={`text-sm ${
                        product.inStock ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-surface rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              Customer Points Management
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Total Customers</h3>
                  <p className="text-3xl font-bold text-secondary">0</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Total Check-ins</h3>
                  <p className="text-3xl font-bold text-secondary">0</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Points Issued</h3>
                  <p className="text-3xl font-bold text-secondary">0</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-surface rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-secondary" />
              Recent Check-ins
            </h2>
            <div className="space-y-4">
              {mockCheckIns.length === 0 ? (
                <p className="text-gray-600">No check-ins yet.</p>
              ) : (
                mockCheckIns.map((checkIn) => (
                  <div
                    key={checkIn.id}
                    className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">Customer ID: {checkIn.userId}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(checkIn.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-secondary font-medium">
                      +{checkIn.points} points
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* Edit Product Dialog */}
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            {editingProduct && (
              <ProductForm
                onSubmit={handleUpdateProduct}
                initialProduct={editingProduct}
                availableLocations={availableLocations}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StoreOwner;
