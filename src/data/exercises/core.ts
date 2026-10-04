import { createExercise } from "../exerciseFactory";

export const coreExercises = [
  "Plank",
  "Side Plank",
  "Mountain Climbers",
  "Bicycle Crunches",
  "Crunches",
  "Reverse Crunches",
  "Sit-Ups",
  "Leg Raises",
  "Hanging Leg Raises",
  "Knee Raises",
  "Flutter Kicks",
  "Russian Twists",
  "V-Ups",
  "Toe Touches",
  "Dead Bug",
  "Bird Dog",
  "Heel Taps",
  "Plank Shoulder Taps",
  "Plank Jacks",
  "Hollow Body Hold",
].map((name) => createExercise(name, "core"));
