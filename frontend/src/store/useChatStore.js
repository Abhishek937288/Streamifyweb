import { create } from "zustand";

export const useChatStore = create((set) => ({
  handleVideoCall: null,
  setHandleVideoCall: (fn) => set({ handleVideoCall: fn }),
}));
