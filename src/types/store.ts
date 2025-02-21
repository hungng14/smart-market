
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  location: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  image: string;
  products: Product[];
}
