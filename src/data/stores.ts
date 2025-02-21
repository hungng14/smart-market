
import { Store } from "@/types/store";

export const stores: Store[] = [
  {
    id: "1",
    name: "Fresh Market Central",
    address: "123 Main St, Downtown",
    image: "/placeholder.svg",
    products: [
      {
        id: "1",
        name: "Organic Bananas",
        category: "Fruits",
        price: 2.99,
        inStock: true,
        location: "A1"
      },
      {
        id: "2",
        name: "Whole Grain Bread",
        category: "Bakery",
        price: 3.49,
        inStock: true,
        location: "B3"
      },
      {
        id: "3",
        name: "Fresh Milk 1L",
        category: "Dairy",
        price: 2.49,
        inStock: true,
        location: "C2"
      }
    ]
  },
  {
    id: "2",
    name: "Super Save Market",
    address: "456 Oak Ave, Westside",
    image: "/placeholder.svg",
    products: [
      {
        id: "4",
        name: "Chicken Breast",
        category: "Meat",
        price: 7.99,
        inStock: true,
        location: "D1"
      },
      {
        id: "5",
        name: "Rice 5kg",
        category: "Grains",
        price: 12.99,
        inStock: true,
        location: "E4"
      },
      {
        id: "6",
        name: "Tomatoes",
        category: "Vegetables",
        price: 1.99,
        inStock: true,
        location: "A2"
      }
    ]
  }
];
