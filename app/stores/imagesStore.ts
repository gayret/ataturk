"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ImagesStore {
  showImages: boolean;
  toggleImages: () => void;
}

export const useImagesStore = create<ImagesStore>()(
  persist(
    (set) => ({
      showImages: true,

      toggleImages: () => set((state) => ({ showImages: !state.showImages })),
    }),
    {
      name: "images-visibility-storage",
    }
  )
);
