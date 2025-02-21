
export interface CheckIn {
  id: string;
  userId: string;
  storeId: string;
  timestamp: Date;
  points: number;
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
