import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ITimerListStore {
    timers: number;
    addTimer: () => void;
}

export const useTimerListStore = create<ITimerListStore>()(
    persist(
        (set, get) => ({
            timers: 0,
            addTimer: () => set({ timers: get().timers + 1 }),
        }),
        {
            name: "timer-storage", // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
        }
    )
);
