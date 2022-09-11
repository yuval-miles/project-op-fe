import create from "zustand";

export const useSocket = create((set) => ({
  socket: null,
  setSocket: (socket) => set((state) => ({ ...state, socket })),
  clearSocket: () => set((state) => ({ ...state, socket: null })),
}));
