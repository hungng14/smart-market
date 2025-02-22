
import { Voucher } from "./points";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  booth: string;
  store_owner_id?: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  image: string;
  products: Product[];
  checkInPoints: number;
  vouchers: Voucher[];
}

export interface StoreStats {
  totalCustomers: number;
  totalCheckIns: number;
  pointsIssued: number;
}
