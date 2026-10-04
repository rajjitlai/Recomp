import { createExercise } from "../exerciseFactory";

export const quadsExercises = [
  "Barbell Squat",
  "Front Squat",
  "Hack Squat",
  "Leg Press",
  "Bulgarian Split Squat",
  "Walking Lunges",
  "Reverse Lunges",
  "Forward Lunges",
  "Goblet Squat",
  "Sissy Squat",
  "Step-Ups",
  "Leg Extension",
].map((name) => createExercise(name, "quads"));
