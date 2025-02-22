import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Store } from "@/types/store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const StoreSelection = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwnerStores();
  }, []);

  const fetchOwnerStores = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const userId = userData.id;
      if (!userId) {
        toast.error("User not logged in");
        navigate("/login");
        return;
      }
      const { data: storeData, error: storeError } = await supabase
        .from<StoreData>("store")
        .select("id, name, address, banner_url")
        .eq("owner_id", userId);
      if (storeError) {
        throw storeError;
      }
      setStores(storeData ?? []);
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Failed to fetch your stores");
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSelect = (storeId: string) => {
    navigate(`/owner/store/${storeId}`);
  };

  const [showCreateModal, setShowCreateModal] = useState(false);
const [newStore, setNewStore] = useState({
  name: '',
  address: '',
  description: '',
  banner_url: ''
});

const handleCreateStore = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const { data, error } = await supabase
      .from('store')
      .insert([
        {
          ...newStore,
          owner_id: userData.id
        }
      ])
      .select()
      .single();

    if (error) throw error;

    setStores([...stores, data]);
    setShowCreateModal(false);
    setNewStore({ name: '', address: '', description: '', banner_url: '' });
    toast.success('Store created successfully!');
  } catch (error) {
    console.error('Error creating store:', error);
    toast.error('Failed to create store');
  }
};

  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Your Stores</h1>
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <button className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create New Store
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Store</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="name">Store Name</label>
                    <input
                      id="name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      value={newStore.name}
                      onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="address">Address</label>
                    <input
                      id="address"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      value={newStore.address}
                      onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2"
                      value={newStore.description}
                      onChange={(e) => setNewStore({ ...newStore, description: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="banner">Banner URL</label>
                    <input
                      id="banner"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      value={newStore.banner_url}
                      onChange={(e) => setNewStore({ ...newStore, banner_url: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateStore}>Create Store</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading your stores...</div>
          ) : stores.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                You don't have any stores yet.
              </p>
              <button
                onClick={handleCreateStore}
                className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create Your First Store
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => handleStoreSelect(store.id)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                >
                  <div
                    className="h-40 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${store.banner_url || "/placeholder.svg"})`,
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {store.name}
                    </h3>
                    <p className="text-gray-600 mt-1">{store.address}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StoreSelection;
