import { Voucher } from "./points";

export interface Product {
  id: string;
  name: string;
  price: number;
  booth: string;
  boothImage: string;
  store_owner_id?: string;
  inStock?: boolean;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  banner_url: string;
  products?: Product[];
  checkInPoints?: number;
  vouchers?: Voucher[];
}

export interface StoreStats {
  totalCustomers: number;
  totalCheckIns: number;
  pointsIssued: number;
}
