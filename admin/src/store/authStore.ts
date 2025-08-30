import { create } from "zustand";
import { Admin } from "@/types";

type AuthStore = {
  token: string | null | undefined;
  user: Admin | null;
  setUser: (user: Admin | null) => void;
  setToken: (token: string | null) => void;
};

const useAuthStore = create<AuthStore>((set) => ({
  token: "",
  user: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
}));

export default useAuthStore;
