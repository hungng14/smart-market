
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
        category: "default", // We can expand this later
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter product name"
          required
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
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
          required
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Booth Location
        </label>
        <Select value={location} onValueChange={setLocation} required>
          <SelectTrigger>
            <SelectValue placeholder="Select booth location" />
          </SelectTrigger>
          <SelectContent>
            {availableLocations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : initialProduct ? "Update Product" : "Add Product"}
      </Button>
    </form>
  );
};
