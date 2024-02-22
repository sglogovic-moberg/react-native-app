import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IBasePlant, IPlantDetails, IPlantGuide, WateringOptionsEnum } from "../models/plantModels";
import * as Notifications from "expo-notifications";
import { DateTime } from "luxon";

export interface IWateredPlantInfo {
    lastWatered: DateTime;
    nextWatering: DateTime;
    plantId: number;
}

export interface IPlantListStore {
    plants: Array<IBasePlant>;
    addPlant: (data: IBasePlant) => void;
    clearPlants: () => void;
    wateredPlants: Array<IWateredPlantInfo>;
    waterPlant: (plantId: number) => void;
    plantDetailsCache: IPlantDetails[];
    addPlantDetailsCache: (data: IPlantDetails) => void;
    plantGuidesCache: IPlantGuide[] | [] | undefined;
    addPlantGuidesCache: (data: IPlantGuide) => void;
    getPlantDetail: (id: number) => IPlantDetails | undefined;
    getPlantGuide: (id: number) => IPlantGuide | undefined;
    deletePlant: (id: number) => void;
}

export const usePlantListStore = create<IPlantListStore>()(
    persist(
        (set, get) => ({
            getPlantDetail: id => {
                const plantDetailsCache = get().plantDetailsCache;
                return plantDetailsCache.find(p => p.id === id);
            },
            getPlantGuide: id => {
                const plantGuidesCache = get().plantGuidesCache;
                return plantGuidesCache!.find(p => p.id === id);
            },
            plantGuidesCache: [],
            addPlantGuidesCache: data => {
                const plantGuidesCache = get().plantGuidesCache;
                const newPlantGuidesCache = [...plantGuidesCache!, data];
                set({ plantGuidesCache: newPlantGuidesCache });
            },
            plantDetailsCache: [],
            addPlantDetailsCache: data => {
                const plantDetailsCache = get().plantDetailsCache;
                const newPlantDetailsCache = [...plantDetailsCache, data];
                set({ plantDetailsCache: newPlantDetailsCache });
            },
            plants: [],
            addPlant: data => {
                const plants = get().plants;
                const newPlants = [...plants, data];
                set({ plants: newPlants });
            },
            clearPlants: () => {
                set({ plants: new Array<IBasePlant>() });
                set({ wateredPlants: new Array<IWateredPlantInfo>() });
            },
            wateredPlants: [],
            waterPlant: plantId => {
                const plant = get().plants.find(p => p != null && p.id === plantId);
                const wateredPlant = get().wateredPlants.find(p => p.plantId === plantId);

                if (!plant) {
                    throw new Error("Plant not found");
                }

                if (plant && !wateredPlant) {
                    const nextWateringDays =
                        plant.watering.toLowerCase() === WateringOptionsEnum.Frequent
                            ? 7
                            : plant.watering.toLowerCase() === WateringOptionsEnum.Average
                            ? 14
                            : 21;

                    const newWateredPlant: IWateredPlantInfo = {
                        lastWatered: DateTime.now(),
                        nextWatering: DateTime.now().plus({ days: nextWateringDays }),
                        plantId: plantId,
                    };

                    set({ wateredPlants: [...get().wateredPlants, newWateredPlant] });

                    Notifications.scheduleNotificationAsync({
                        content: {
                            title: "Plant watering reminder",
                            body: "One of your plants needs watering! 💦",
                        },
                        trigger: {
                            seconds: 5,
                        },
                    });
                }
            },
            deletePlant: id => {
                const plants = get().plants;
                const newPlants = plants.filter(p => p.id !== id);
                set({ plants: newPlants });
            },
        }),
        {
            name: "plant-storage", // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
        }
    )
);
