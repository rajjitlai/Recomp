import { createExercise } from "../exerciseFactory";

export const calvesExercises = [
  "Standing Calf Raise",
  "Seated Calf Raise",
  "Leg Press Calf Raise",
  "Smith Machine Calf Raise",
  "Donkey Calf Raise",
  "Single-Leg Calf Raise",
].map((name) => createExercise(name, "calves"));
