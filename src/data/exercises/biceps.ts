import { createExercise } from "../exerciseFactory";

export const bicepsExercises = [
  "Barbell Curl",
  "EZ-Bar Curl",
  "Dumbbell Curl",
  "Alternating Dumbbell Curl",
  "Incline Dumbbell Curl",
  "Hammer Curl",
  "Cross-Body Hammer Curl",
  "Preacher Curl",
  "Preacher Hammer Curl",
  "Concentration Curl",
  "Cable Curl",
  "Rope Cable Curl",
  "Bayesian Curl",
  "Spider Curl",
  "Reverse Curl",
  "Zottman Curl",
  "Drag Curl",
  "Machine Biceps Curl",
  "Single-Arm Cable Curl",
].map((name) => createExercise(name, "biceps"));
