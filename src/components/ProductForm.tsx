
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
import { Product } from "@/types/store";

interface ProductFormProps {
  onSubmit: (product: Omit<Product, "id">) => Promise<void>;
  initialProduct?: Product;
  availableLocations: string[];
}

export const ProductForm = ({ onSubmit, initialProduct, availableLocations }: ProductFormProps) => {
  const [name, setName] = useState(initialProduct?.name || "");
  const [price, setPrice] = useState(initialProduct?.price?.toString() || "");
  const [location, setLocation] = useState(initialProduct?.location || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !location) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        price: parseFloat(price),
        location,
        category: "default",
        inStock: true,
      });
      toast.success(`Product ${initialProduct ? "updated" : "added"} successfully`);
      if (!initialProduct) {
        setName("");
        setPrice("");
        setLocation("");
      }
    } catch (error) {
      toast.error("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
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
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Booth Location
        </label>
        <Select value={location} onValueChange={setLocation} required>
          <SelectTrigger className="w-full px-4 py-2 text-left border rounded-lg focus:ring-2 focus:ring-secondary bg-white">
            <SelectValue placeholder="Select booth location" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {availableLocations.map((loc) => (
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

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-secondary hover:bg-secondary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {isSubmitting ? "Saving..." : initialProduct ? "Update Product" : "Add Product"}
      </Button>
    </form>
  );
};
