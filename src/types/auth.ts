
export type UserRole = "owner" | "shopper";

export interface AuthState {
  user: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
  } | null;
}
