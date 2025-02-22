
import { Store } from "@/types/store";

export const stores: Store[] = [
  {
    id: "1",
    name: "Fresh Market Central",
    address: "123 Main St, Downtown",
    banner_url: "https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?w=500&auto=format",
    checkInPoints: 10,
    vouchers: [],
    products: [
      {
        id: "1",
        name: "Organic Bananas",
        category: "Fruits",
        price: 2.99,
        inStock: true,
        booth: "A1",
        boothImage: "https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?w=500&auto=format"
      },
      {
        id: "2",
        name: "Fresh Apples",
        category: "Fruits",
        price: 1.99,
        inStock: true,
        booth: "A1",
        boothImage: "https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?w=500&auto=format"
      },
      {
        id: "3",
        name: "Whole Grain Bread",
        category: "Bakery",
        price: 3.49,
        inStock: true,
        booth: "B3",
        boothImage: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&auto=format"
      },
      {
        id: "4",
        name: "Croissants",
        category: "Bakery",
        price: 2.49,
        inStock: true,
        booth: "B3",
        boothImage: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&auto=format"
      },
      {
        id: "5",
        name: "Fresh Milk 1L",
        category: "Dairy",
        price: 2.49,
        inStock: true,
        booth: "C2",
        boothImage: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format"
      },
      {
        id: "6",
        name: "Greek Yogurt",
        category: "Dairy",
        price: 3.99,
        inStock: true,
        booth: "C2",
        boothImage: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format"
      },
      {
        id: "7",
        name: "Chicken Breast",
        category: "Meat",
        price: 7.99,
        inStock: true,
        booth: "D1",
        boothImage: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&auto=format"
      },
      {
        id: "8",
        name: "Ground Beef",
        category: "Meat",
        price: 6.99,
        inStock: true,
        booth: "D1",
        boothImage: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&auto=format"
      }
    ]
  },
  {
    id: "2",
    name: "David Market Central",
    address: "11 David St, New York",
    banner_url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format",
    checkInPoints: 10,
    vouchers: [],
    products: [
      {
        id: "1",
        name: "Organic Bananas",
        category: "Fruits",
        price: 2.99,
        inStock: true,
        booth: "A1"
      },
      {
        id: "2",
        name: "Whole Grain Bread",
        category: "Bakery",
        price: 3.49,
        inStock: true,
        booth: "B3"
      },
      {
        id: "3",
        name: "Fresh Milk 1L",
        category: "Dairy",
        price: 2.49,
        inStock: true,
        booth: "C2"
      }
    ]
  },
  {
    id: "2",
    name: "Super Save Market",
    address: "456 Oak Ave, Westside",
    image: "/placeholder.svg",
    checkInPoints: 10,
    vouchers: [],
    products: [
      {
        id: "4",
        name: "Chicken Breast",
        category: "Meat",
        price: 7.99,
        inStock: true,
        booth: "D1"
      },
      {
        id: "5",
        name: "Rice 5kg",
        category: "Grains",
        price: 12.99,
        inStock: true,
        booth: "E4"
      },
      {
        id: "6",
        name: "Tomatoes",
        category: "Vegetables",
        price: 1.99,
        inStock: true,
        booth: "A2"
      }
    ]
  }
];
