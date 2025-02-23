import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/store";

interface ProductFormProps {
  onSubmit: (product: Omit<Product, "id">) => Promise<void>;
  initialProduct?: Product;
  availableBooths: string[];
  storeId: string; // Added storeId prop
}

export const ProductForm = ({
  onSubmit,
  initialProduct,
  availableBooths,
  storeId, // Using storeId prop
}: ProductFormProps) => {
  const [name, setName] = useState(initialProduct?.name || "");
  const [price, setPrice] = useState(initialProduct?.price?.toString() || "");
  const [booth, setBooth] = useState(initialProduct?.booth || "");
  const [imageUrl, setImageUrl] = useState(initialProduct?.image_url || ""); // Added image URL state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !booth || !imageUrl) { // Added imageUrl to validation
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      //const { data: { session }, } = await supabase.auth.getSession();
      //const userId = session?.user?.id;

      //if (!userId) {
      //  throw new Error("Not authenticated");
      //}

      await onSubmit({
        name,
        price: parseFloat(price),
        booth,
        store_id: storeId, // Using storeId prop
        image_url: imageUrl, // Added image URL to submission
      });
      toast.success(
        `Product ${initialProduct ? "updated" : "added"} successfully`,
      );
      if (!initialProduct) {
        setName("");
        setPrice("");
        setBooth("");
        setImageUrl(""); // Clear image URL after submission
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Product Name
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter product name"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
          required
        />
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Price
        </label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
          required
        />
      </div>

      <div>
        <label
          htmlFor="booth"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Booth Location
        </label>
        <Select value={booth} onValueChange={setBooth} required>
          <SelectTrigger className="w-full px-4 py-2 text-left border rounded-lg focus:ring-2 focus:ring-secondary bg-white">
            <SelectValue placeholder="Select booth location" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {availableBooths.map((loc) => (
              <SelectItem
                key={loc}
                value={loc}
                className="hover:bg-secondary/10 cursor-pointer px-4 py-2"
              >
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label
          htmlFor="imageUrl"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Image URL
        </label>
        <Input
          id="imageUrl"
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
          placeholder="Enter product image URL"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-secondary hover:bg-secondary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {isSubmitting
          ? "Saving..."
          : initialProduct
            ? "Update Product"
            : "Add Product"}
      </Button>
    </form>
  );
};