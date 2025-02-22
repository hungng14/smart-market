
import { UserRole } from "@/types/auth";

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
}

export const users: User[] = [
  {
    id: "1",
    email: "owner@store.com",
    password: "owner123",
    role: "owner",
    name: "John Store"
  },
  {
    id: "2",
    email: "shopper@email.com",
    password: "shopper123",
    role: "shopper",
    name: "Alice Shopper"
  }
];
