import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSaveQueue, decodeData } from "./state";

// Retained across the Recomp rename so existing progress remains available.
const STORAGE_KEY = "form-workout:v1";
export const loadData = async () =>
  decodeData(await AsyncStorage.getItem(STORAGE_KEY));
export const saveData = createSaveQueue((raw) =>
  AsyncStorage.setItem(STORAGE_KEY, raw),
);
