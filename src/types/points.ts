
export interface CheckIn {
  id: string;
  user_id: string;
  store_id: string;
  created_at: Date;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  store: {
    id: string;
    name: string;
    banner_url: string;
  };
}

export interface Voucher {
  id: string;
  storeId: string;
  name: string;
  description: string;
  pointsCost: number;
  expiryDate: Date;
}

export interface UserPoints {
  storeId: string;
  points: number;
}
