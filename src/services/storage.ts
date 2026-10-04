import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSaveQueue, decodeData } from "./state";

const STORAGE_KEY = "form-workout:v1";
export const loadData = async () =>
  decodeData(await AsyncStorage.getItem(STORAGE_KEY));
export const saveData = createSaveQueue((raw) =>
  AsyncStorage.setItem(STORAGE_KEY, raw),
);
