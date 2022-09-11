import create from "zustand";

export const useUserData = create((set) => ({
  userData: null,
  setUserData: (userData) => set((state) => ({ ...state, userData })),
  clearUserData: () => set((state) => ({ ...state, userData: null })),
}));
